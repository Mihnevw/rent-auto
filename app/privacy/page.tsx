"use client"

import { useLanguage } from "@/lib/language-context"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
        {t("privacyPolicyFooter")}
      </h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Въведение</h2>
          <p className="text-gray-600 mb-4">
            Ние от AUTO RENT ЕООД се ангажираме да защитаваме и уважаваме Вашата поверителност. Настоящата политика обяснява какви лични данни събираме, как ги използваме, на какво правно основание ги обработваме, и какви са Вашите права съгласно Общия регламент относно защитата на данните (GDPR) и българското законодателство.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Каква информация събираме</h2>
          <p className="text-gray-600 mb-4">
            Събираме само основни лични данни за Вас, които не включват специални категории лични данни („чувствителни данни“). Личната информация, която събираме може да включва името, адреса, e-mail адреса, телефонния номер, други данни, изисквани от Закона за счетоводството и други закони, както и информация относно това кои страници са посетени и кога.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Как използваме вашата информация</h2>
          <p className="text-gray-600 mb-4">Получаваме информация за Вас, когато използвате сайта ни, например когато изпращате запитване за получаване на оферта/информация, или в процеса, при който заявявате, поръчвате и ползвате предоставяните на сайта услуги.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Съхранение на данните</h2>
          <p className="text-gray-600 mb-4">
            Съхраняваме вашите лични данни само толкова дълго, колкото е необходимо за целите, за които са събрани, включително за спазване на законови изисквания.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Вашите права</h2>
          <p className="text-gray-600 mb-4">
            Имате следните права по отношение на вашите лични данни:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Право на достъп до вашите лични данни</li>
            <li>Право на коригиране на неточни лични данни</li>
            <li>Право на изтриване на лични данни</li>
            <li>Право на ограничаване на обработването</li>
            <li>Право на преносимост на данните</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Контакт</h2>
          <p className="text-gray-600 mb-4">
            Ако имате въпроси относно тази политика за поверителност или как обработваме вашите лични данни, моля свържете се с нас на:
          </p>
          <ul className="list-none pl-6 text-gray-600 mb-4">
            <li>Имейл: {t("officeEmail")}</li>
            <li>Телефон: +359 894818283</li>
            <li>Адрес: {t("officeAddress")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Промени в политиката за поверителност</h2>
          <p className="text-gray-600">
            Запазваме си правото да актуализираме тази политика за поверителност по всяко време. Всички промени ще бъдат публикувани на тази страница.
          </p>
        </section>
      </div>
    </div>
  )
} 