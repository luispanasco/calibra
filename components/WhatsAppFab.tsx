import { whatsappUrl } from "@/lib/links";
import { WhatsAppIcon } from "./Icons";

export function WhatsAppFab({ phone }: { phone: string }) {
  return (
    <a
      href={whatsappUrl(phone, "Hola, quiero consultar por equipos Calibra.")}
      target="_blank"
      rel="noopener"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_rgb(0_0_0/0.5)] transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
