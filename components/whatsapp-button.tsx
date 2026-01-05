import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppButton() {
  const phoneNumber = "+22671671801"
  const message = "Bonjour, j'ai une question concernant votre catalogue"
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <Button size="lg" className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow">
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  )
}
