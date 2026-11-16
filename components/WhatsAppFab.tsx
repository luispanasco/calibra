import { whatsappUrl } from "@/lib/links";
import { DEFAULT_MESSAGE } from "@/lib/contacts";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppFab({ phone }: { phone: string }) {
  return (
    <a
      href={whatsappUrl(phone, DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-orange text-ink shadow-[0_10px_30px_rgb(0_0_0/0.5),0_0_28px_rgb(248_119_47/0.45)] ring-1 ring-white/20 transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
