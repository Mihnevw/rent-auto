import { useLanguage } from "@/lib/language-context"

export function GoogleReviewsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <a href="#" className="text-blue-600 hover:text-blue-700 text-lg font-semibold">
          {t("googleReviews")}
        </a>
      </div>
    </section>
  )
} 