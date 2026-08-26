"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  Plus, Loader2, Globe, Lock, Search, ShoppingBag, ImagePlus, X, Copy, Trash2,
} from "lucide-react";
import { createOffer, deleteOffer, getOffers } from "@/app/actions/offers";
import { publishItem, unpublishItem } from "@/app/actions/publish";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { formatKobo, parseNairaInput } from "@/lib/money";
import { toast } from "sonner";

export default function OffersPage() {
  const { user } = useAuth();

  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getOffers();
      if (!res.success) throw new Error(res.error);
      setOffers(res.offers || []);
    } catch (error) {
      console.error(error);
      setLoadError("Couldn't load your offers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = offers.filter((o) =>
    o.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublish = async (offer: any) => {
    const isLive = offer.publish_status === "published";
    const res = isLive
      ? await unpublishItem("offer", offer.id)
      : await publishItem("offer", offer.id);

    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success(isLive ? "Offer unpublished." : "Offer is live.");
    load();
  };

  const handleDelete = async (offer: any) => {
    const res = await deleteOffer(offer.id);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success("Offer deleted.");
    load();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Offers</h1>
          <p className="mt-1 text-xs text-subtle">
            Digital products, courses and sessions you sell.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-subtle" />
            <input
              type="text"
              placeholder="Search offers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-xs text-text focus:border-white/20 focus:outline-none sm:w-56"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> New offer
          </button>
        </div>
      </div>

      {showForm && (
        <OfferForm
          userId={user?.id}
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-border bg-surface py-20">
          <Loader2 className="h-6 w-6 animate-spin text-subtle" />
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-border bg-surface py-16 text-center">
          <p className="text-sm text-text">{loadError}</p>
          <button
            onClick={load}
            className="mt-4 rounded-lg border border-border bg-muted px-4 py-2 text-xs font-medium text-text"
          >
            Retry
          </button>
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-subtle">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-text">No offers yet</p>
          <p className="mx-auto mt-1 max-w-sm px-6 text-xs text-subtle">
            Create your first digital product, course or session. It saves as a draft, so
            nothing goes public until you say so.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mx-auto mt-6 flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black"
          >
            <Plus className="h-4 w-4" /> Create an offer
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((o) => (
            <OfferCard
              key={o.id}
              offer={o}
              onTogglePublish={() => handleTogglePublish(o)}
              onDelete={() => handleDelete(o)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function OfferCard({
  offer,
  onTogglePublish,
  onDelete,
}: {
  offer: any;
  onTogglePublish: () => void;
  onDelete: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isLive = offer.publish_status === "published";
  const priceKobo = Number(offer.price_kobo ?? 0);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/offer/${offer.id}` : "";

  const run = async (fn: () => Promise<void> | void) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative h-32 w-full bg-muted">
        {offer.cover_image_url ? (
          <img src={offer.cover_image_url} alt={offer.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-subtle">
            <ShoppingBag className="h-7 w-7 opacity-20" />
          </div>
        )}
        <div
          className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md ${
            isLive ? "bg-emerald-600/90" : "bg-black/60"
          }`}
        >
          {isLive ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
          {isLive ? "Live" : "Draft"}
        </div>
      </div>

      <div className="p-5">
        <h3 className="truncate text-base font-bold text-text">{offer.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-subtle">
          {offer.description || "No description yet."}
        </p>

        <p className="mt-4 text-lg font-bold text-emerald-500">
          {priceKobo === 0 ? "Free" : formatKobo(priceKobo)}
        </p>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => run(onTogglePublish)}
            disabled={busy}
            className={`flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-bold transition-colors disabled:opacity-60 ${
              isLive
                ? "border border-border bg-muted text-text"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isLive ? "Unpublish" : "Publish"}
          </button>

          {isLive && (
            <button
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl);
                toast.success("Link copied");
              }}
              title="Copy share link"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-subtle hover:text-text"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={() => (confirmDelete ? run(onDelete) : setConfirmDelete(true))}
            onBlur={() => setConfirmDelete(false)}
            title={confirmDelete ? "Click again to confirm" : "Delete"}
            className={`flex h-9 items-center justify-center rounded-lg border text-xs transition-colors ${
              confirmDelete
                ? "border-red-500/40 bg-red-500/10 px-3 font-bold text-red-500"
                : "w-9 border-border bg-muted text-subtle hover:text-red-500"
            }`}
          >
            {confirmDelete ? "Sure?" : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function OfferForm({
  userId,
  onClose,
  onCreated,
}: {
  userId?: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const priceKobo = isFree ? 0 : parseNairaInput(priceInput || "0");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = () => {
    if (!title.trim()) {
      toast.error("Give your offer a title.");
      return;
    }
    if (priceKobo === null) {
      toast.error("Enter a valid price.");
      return;
    }

    startTransition(async () => {
      let coverImageUrl: string | null = null;

      if (imageFile && userId) {
        const supabase = createClient();
        const ext = imageFile.name.split(".").pop();
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("offer_covers").upload(path, imageFile);

        if (error) {
          toast.error("Couldn't upload the cover image.");
          return;
        }
        coverImageUrl = supabase.storage.from("offer_covers").getPublicUrl(path).data.publicUrl;
      }

      const res = await createOffer({
        title,
        description,
        price_kobo: priceKobo,
        cover_image_url: coverImageUrl,
      });

      if (!res.success) {
        toast.error(res.error || "Could not create the offer.");
        return;
      }

      toast.success("Offer saved as a draft.");
      onCreated();
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-text">New offer</h2>
        <button onClick={onClose} className="text-subtle hover:text-text">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-[200px_1fr]">
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-border bg-muted"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Cover" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center">
                <ImagePlus className="mx-auto h-6 w-6 text-subtle opacity-40" />
                <p className="mt-1 text-[10px] text-subtle">Cover image</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-subtle">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lightroom preset pack"
              className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-text placeholder:text-subtle focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-subtle">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What does the buyer get?"
              className="w-full resize-none rounded-lg border border-border bg-muted p-3 text-sm text-text placeholder:text-subtle focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-subtle">Price</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFree(!isFree)}
                className={`h-10 shrink-0 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                  isFree
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                    : "border-border bg-muted text-subtle"
                }`}
              >
                {isFree ? "Free" : "Paid"}
              </button>
              {!isFree && (
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle">₦</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="0"
                    className="h-10 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-sm text-text focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={submit}
              disabled={isPending}
              className="flex h-10 items-center justify-center rounded-lg bg-white px-5 text-xs font-bold text-black disabled:opacity-60"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save draft"}
            </button>
            <p className="text-[11px] text-subtle">
              Saved as a draft — publish it when you&apos;re ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
