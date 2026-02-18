"use client";

import Script from "next/script";

const BREVO_FORM_URL =
  "https://0cddd0eb.sibforms.com/serve/MUIFAKFWjgVUbvsv7x-tInNCkcJiq_fhzNe1xFe32HUX5yvj6665xWFafEJbKcmjliWx6Ly-MFEUIuG0oLooQDPUd6h_7VYxBy2BczTSnKXlxib6XpHaI3NUgoUDXawKNY7g-OZcWBIfuNPdaaS6H3N00SGNELvBOQCGuESDYvCIZOd4jbU5y5NdGakJuaU4FsHFKtQX-SCiqr_V";

export default function Newsletter() {
  return (
    <section className="w-full py-24 px-6 bg-zinc-950">
      {/* Brevo global config */}
      <Script id="brevo-config" strategy="lazyOnload">{`
        window.REQUIRED_CODE_ERROR_MESSAGE = 'Elija un código de país';
        window.LOCALE = 'es';
        window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo.";
        window.REQUIRED_ERROR_MESSAGE = "Este campo no puede quedarse vacío.";
        window.GENERIC_INVALID_MESSAGE = "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo.";
        window.translation = {
          common: {
            selectedList: '{quantity} lista seleccionada',
            selectedLists: '{quantity} listas seleccionadas',
            selectedOption: '{quantity} seleccionado',
            selectedOptions: '{quantity} seleccionados',
          }
        };
        var AUTOHIDE = Boolean(0);
      `}</Script>
      <Script
        src="https://sibforms.com/forms/end-form/build/main.js"
        strategy="lazyOnload"
      />

      <div className="max-w-xl mx-auto text-center">
        <span className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase">
          Newsletter
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-3 mb-4">
          Stay Updated
        </h2>
        <p className="text-sm text-white/50 mb-10 leading-relaxed">
          New photo stories and collections delivered to your inbox.
        </p>

        {/* Brevo form — IDs must stay for their JS to work */}
        <div className="sib-form">
          <div id="sib-form-container" className="sib-form-container">
            {/* Error message */}
            <div
              id="error-message"
              className="sib-form-message-panel"
              style={{
                fontSize: 14,
                textAlign: "center",
                color: "#fca5a5",
                backgroundColor: "rgba(239,68,68,0.1)",
                borderRadius: 8,
                borderColor: "transparent",
                maxWidth: 448,
                margin: "0 auto 16px",
                display: "none",
              }}
            >
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <span className="sib-form-message-panel__inner-text">
                  No hemos podido validar su suscripción.
                </span>
              </div>
            </div>

            {/* Success message */}
            <div
              id="success-message"
              className="sib-form-message-panel"
              style={{
                fontSize: 14,
                textAlign: "center",
                color: "rgba(255,255,255,0.5)",
                backgroundColor: "transparent",
                borderRadius: 8,
                borderColor: "transparent",
                maxWidth: 448,
                margin: "0 auto 16px",
                display: "none",
              }}
            >
              <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                <span className="sib-form-message-panel__inner-text">
                  Thanks for subscribing!
                </span>
              </div>
            </div>

            {/* Form container — no visible border/bg, Brevo JS needs the ID */}
            <div
              id="sib-container"
              className="sib-container--large sib-container--vertical"
              style={{
                textAlign: "center",
                backgroundColor: "transparent",
                maxWidth: 448,
                borderWidth: 0,
                margin: "0 auto",
              }}
            >
              <form
                id="sib-form"
                method="POST"
                action={BREVO_FORM_URL}
                data-type="subscription"
                className="flex gap-3 max-w-md mx-auto"
              >
                <div className="sib-input sib-form-block flex-1">
                  <div className="form__entry entry_block">
                    <div className="form__label-row">
                      <div className="entry__field">
                        <input
                          className="input"
                          type="text"
                          id="EMAIL"
                          name="EMAIL"
                          autoComplete="off"
                          placeholder="your@email.com"
                          data-required="true"
                          required
                          style={{
                            width: "100%",
                            padding: "12px 20px",
                            borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#ffffff",
                            fontSize: 14,
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                    <label
                      className="entry__error entry__error--primary"
                      style={{
                        fontSize: 12,
                        color: "#fca5a5",
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                      }}
                    />
                  </div>
                </div>

                <div className="sib-form-block">
                  <button
                    className="sib-form-block__button sib-form-block__button-with-loader"
                    form="sib-form"
                    type="submit"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#18181b",
                      backgroundColor: "#ffffff",
                      borderRadius: 8,
                      borderWidth: 0,
                      padding: "12px 32px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg
                      className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon"
                      viewBox="0 0 512 512"
                      style={{ width: 0, height: 0 }}
                    >
                      <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                    </svg>
                    Subscribe
                  </button>
                </div>

                {/* Honeypot + locale */}
                <input
                  type="text"
                  name="email_address_check"
                  defaultValue=""
                  className="input--hidden"
                  style={{ display: "none" }}
                />
                <input type="hidden" name="locale" value="es" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
