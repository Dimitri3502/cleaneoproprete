import Script from 'next/script';

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src="/cleaneo-logo.jpg"
              alt="Cleaneo Propreté"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="inline-flex items-center rounded-full border border-border bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Entreprise de nettoyage 🌱
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Bienvenue chez Cleaneo Propreté
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Nous assurons l’entretien régulier et les interventions ponctuelles pour les bureaux,
            copropriétés et locaux professionnels en Haute-Savoie. Des prestations soignées, une
            équipe fiable, et des produits respectueux de l’environnement.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:contact@cleaneoproprete.com"
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Demander un devis
            </a>
            <a
              href="tel:+33450982764"
              className="rounded-full border border-border bg-white px-6 py-2 text-sm font-semibold text-foreground transition hover:border-foreground/30"
            >
              Appeler l’équipe
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1">Haute-Savoie 📍</span>
            <span className="rounded-full bg-muted px-3 py-1">Interventions planifiées</span>
            <span className="rounded-full bg-muted px-3 py-1">Produits écoresponsables</span>
          </div>
        </div>
        <div className="relative rounded-[28px] border border-border bg-white/80 p-6 shadow-card">
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-[linear-gradient(140deg,_rgba(16,185,129,0.15),_rgba(250,204,21,0.12))]" />
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Notre promesse
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                Un environnement propre, sain et accueillant
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: 'Qualité contrôlée',
                  detail: 'Des protocoles clairs et un suivi régulier.',
                },
                {
                  label: 'Équipe locale',
                  detail: 'Une présence réactive en Haute-Savoie.',
                },
                {
                  label: 'Respect des lieux',
                  detail: 'Matériels et produits adaptés à chaque surface.',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="prestations" className="space-y-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Prestations
          </p>
          <h2 className="font-heading text-3xl font-semibold text-foreground">
            Un service complet pour vos espaces
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Nettoyage de bureaux',
              detail:
                'Entretien quotidien ou hebdomadaire, dépoussiérage, sols, sanitaires et zones communes.',
            },
            {
              title: 'Copropriétés & immeubles',
              detail:
                'Hall d’entrée, cages d’escalier, ascenseurs, vitrages et zones partagées.',
            },
            {
              title: 'Vitrerie',
              detail:
                'Vitrines, baies vitrées, encadrements et finitions pour un rendu impeccable.',
            },
            {
              title: 'Fin de chantier',
              detail:
                'Remise en état après travaux, évacuation des résidus et préparation à la livraison.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
              <h3 className="font-heading text-xl font-semibold text-foreground">{card.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{card.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="engagement" className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[26px] border border-border bg-white/80 p-6 shadow-card">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-semibold text-foreground">
              Une approche écoresponsable
            </h2>
            <p className="text-sm text-muted-foreground">
              Cleaneo Propreté privilégie des produits certifiés, limite les consommations d’eau et
              adapte ses méthodes à la nature de vos surfaces pour préserver vos espaces.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Produits écologiques sélectionnés',
                'Économie d’eau et de consommables',
                'Interventions discrètes',
                'Plans de passage sur-mesure',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border/70 bg-muted px-4 py-3 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Zones d’intervention
            </p>
            <p className="mt-3 text-lg font-semibold text-foreground">
              Haute-Savoie et alentours
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Nous adaptons les horaires de passage à votre activité pour garantir la continuité de
              vos équipes et la satisfaction de vos clients.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Disponibilité
            </p>
            <p className="mt-3 text-lg font-semibold text-foreground">Réactivité et suivi</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Un interlocuteur dédié pour vos demandes, des visites de contrôle et des ajustements
              rapides si vos besoins évoluent.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="rounded-[30px] border border-border bg-white/80 p-8 shadow-card"
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">
              Parlons de vos besoins
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Écrivez-nous pour une estimation rapide ou pour planifier une visite de vos locaux.
            </p>
          </div>
          <div className="space-y-4 text-sm text-foreground">
            <div className="rounded-2xl border border-border bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </p>
              <a href="mailto:contact@cleaneoproprete.com" className="mt-2 block font-semibold">
                contact@cleaneoproprete.com
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Téléphone
              </p>
              <a href="tel:+33450982764" className="mt-2 block font-semibold">
                +33 (0)4 50 98 27 64
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Localisation
              </p>
              <p className="mt-2 font-semibold">Haute-Savoie 📍</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Instagram
        </p>
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink="https://www.instagram.com/p/DP_d9fjDM_z/?utm_source=ig_embed&amp;utm_campaign=loading"
          data-instgrm-version="14"
          style={{
            background: '#fff',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: 1,
            maxWidth: 540,
            minWidth: 326,
            padding: 0,
            width: '99.375%',
          }}
        >
          <div style={{ padding: 16 }}>
            <a
              href="https://www.instagram.com/p/DP_d9fjDM_z/?utm_source=ig_embed&amp;utm_campaign=loading"
              style={{
                background: '#fff',
                lineHeight: 0,
                padding: '0 0',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%',
                display: 'block',
              }}
              target="_blank"
              rel="noreferrer"
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div
                  style={{
                    backgroundColor: '#f4f4f4',
                    borderRadius: '50%',
                    flexGrow: 0,
                    height: 40,
                    marginRight: 14,
                    width: 40,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: 4,
                      height: 14,
                      marginBottom: 6,
                      width: 100,
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: 4,
                      height: 14,
                      width: 60,
                    }}
                  />
                </div>
              </div>
              <div style={{ padding: '19% 0' }} />
              <div style={{ display: 'block', height: 50, margin: '0 auto 12px', width: 50 }}>
                <svg
                  width="50px"
                  height="50px"
                  viewBox="0 0 60 60"
                  version="1.1"
                  xmlns="https://www.w3.org/2000/svg"
                >
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                      <g>
                        <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div style={{ paddingTop: 8 }}>
                <div
                  style={{
                    color: '#3897f0',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 550,
                    lineHeight: '18px',
                  }}
                >
                  Voir cette publication sur Instagram
                </div>
              </div>
              <div style={{ padding: '12.5% 0' }} />
              <div
                style={{ display: 'flex', flexDirection: 'row', marginBottom: 14, alignItems: 'center' }}
              >
                <div>
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: '50%',
                      height: 12.5,
                      width: 12.5,
                      transform: 'translateX(0px) translateY(7px)',
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      height: 12.5,
                      transform: 'rotate(-45deg) translateX(3px) translateY(1px)',
                      width: 12.5,
                      marginRight: 14,
                      marginLeft: 2,
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: '50%',
                      height: 12.5,
                      width: 12.5,
                      transform: 'translateX(9px) translateY(-18px)',
                    }}
                  />
                </div>
                <div style={{ marginLeft: 8 }}>
                  <div
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '50%', height: 20, width: 20 }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '2px solid transparent',
                      borderLeft: '6px solid #f4f4f4',
                      borderBottom: '2px solid transparent',
                      transform: 'translateX(16px) translateY(-4px) rotate(30deg)',
                    }}
                  />
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div
                    style={{
                      width: 0,
                      borderTop: '8px solid #f4f4f4',
                      borderRight: '8px solid transparent',
                      transform: 'translateY(16px)',
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      height: 12,
                      width: 16,
                      transform: 'translateY(-4px)',
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '8px solid #f4f4f4',
                      borderLeft: '8px solid transparent',
                      transform: 'translateY(-4px) translateX(8px)',
                    }}
                  />
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', marginBottom: 24, alignItems: 'center' }}
              >
                <div
                  style={{
                    backgroundColor: '#f4f4f4',
                    borderRadius: 4,
                    height: 14,
                    marginBottom: 6,
                    width: 224,
                  }}
                />
                <div
                  style={{ backgroundColor: '#f4f4f4', borderRadius: 4, height: 14, width: 144 }}
                />
              </div>
            </a>
            <p
              style={{
                color: '#c9c8cd',
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                lineHeight: '17px',
                marginBottom: 0,
                marginTop: 8,
                overflow: 'hidden',
                padding: '8px 0 7px',
                textAlign: 'center',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <a
                href="https://www.instagram.com/p/DP_d9fjDM_z/?utm_source=ig_embed&amp;utm_campaign=loading"
                style={{
                  color: '#c9c8cd',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 14,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  lineHeight: '17px',
                  textDecoration: 'none',
                }}
                target="_blank"
                rel="noreferrer"
              >
                Une publication partagée par CLEANEO PROPRETE (@cleaneoproprete)
              </a>
            </p>
          </div>
        </blockquote>
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink="https://www.instagram.com/p/DOMYV-4ipNm/?utm_source=ig_embed&amp;utm_campaign=loading"
          data-instgrm-version="14"
          style={{
            background: '#fff',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: 1,
            maxWidth: 540,
            minWidth: 326,
            padding: 0,
            width: '99.375%',
          }}
        >
          <div style={{ padding: 16 }}>
            <a
              href="https://www.instagram.com/p/DOMYV-4ipNm/?utm_source=ig_embed&amp;utm_campaign=loading"
              style={{
                background: '#fff',
                lineHeight: 0,
                padding: '0 0',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%',
                display: 'block',
              }}
              target="_blank"
              rel="noreferrer"
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div
                  style={{
                    backgroundColor: '#f4f4f4',
                    borderRadius: '50%',
                    flexGrow: 0,
                    height: 40,
                    marginRight: 14,
                    width: 40,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: 4,
                      height: 14,
                      marginBottom: 6,
                      width: 100,
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: 4,
                      height: 14,
                      width: 60,
                    }}
                  />
                </div>
              </div>
              <div style={{ padding: '19% 0' }} />
              <div style={{ display: 'block', height: 50, margin: '0 auto 12px', width: 50 }}>
                <svg
                  width="50px"
                  height="50px"
                  viewBox="0 0 60 60"
                  version="1.1"
                  xmlns="https://www.w3.org/2000/svg"
                >
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                      <g>
                        <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div style={{ paddingTop: 8 }}>
                <div
                  style={{
                    color: '#3897f0',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 550,
                    lineHeight: '18px',
                  }}
                >
                  Voir cette publication sur Instagram
                </div>
              </div>
              <div style={{ padding: '12.5% 0' }} />
              <div
                style={{ display: 'flex', flexDirection: 'row', marginBottom: 14, alignItems: 'center' }}
              >
                <div>
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: '50%',
                      height: 12.5,
                      width: 12.5,
                      transform: 'translateX(0px) translateY(7px)',
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      height: 12.5,
                      transform: 'rotate(-45deg) translateX(3px) translateY(1px)',
                      width: 12.5,
                      marginRight: 14,
                      marginLeft: 2,
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      borderRadius: '50%',
                      height: 12.5,
                      width: 12.5,
                      transform: 'translateX(9px) translateY(-18px)',
                    }}
                  />
                </div>
                <div style={{ marginLeft: 8 }}>
                  <div
                    style={{ backgroundColor: '#f4f4f4', borderRadius: '50%', height: 20, width: 20 }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '2px solid transparent',
                      borderLeft: '6px solid #f4f4f4',
                      borderBottom: '2px solid transparent',
                      transform: 'translateX(16px) translateY(-4px) rotate(30deg)',
                    }}
                  />
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div
                    style={{
                      width: 0,
                      borderTop: '8px solid #f4f4f4',
                      borderRight: '8px solid transparent',
                      transform: 'translateY(16px)',
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      height: 12,
                      width: 16,
                      transform: 'translateY(-4px)',
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '8px solid #f4f4f4',
                      borderLeft: '8px solid transparent',
                      transform: 'translateY(-4px) translateX(8px)',
                    }}
                  />
                </div>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', marginBottom: 24, alignItems: 'center' }}
              >
                <div
                  style={{
                    backgroundColor: '#f4f4f4',
                    borderRadius: 4,
                    height: 14,
                    marginBottom: 6,
                    width: 224,
                  }}
                />
                <div
                  style={{ backgroundColor: '#f4f4f4', borderRadius: 4, height: 14, width: 144 }}
                />
              </div>
            </a>
            <p
              style={{
                color: '#c9c8cd',
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                lineHeight: '17px',
                marginBottom: 0,
                marginTop: 8,
                overflow: 'hidden',
                padding: '8px 0 7px',
                textAlign: 'center',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <a
                href="https://www.instagram.com/p/DOMYV-4ipNm/?utm_source=ig_embed&amp;utm_campaign=loading"
                style={{
                  color: '#c9c8cd',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 14,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  lineHeight: '17px',
                  textDecoration: 'none',
                }}
                target="_blank"
                rel="noreferrer"
              >
                Une publication partagée par CLEANEO PROPRETE (@cleaneoproprete)
              </a>
            </p>
          </div>
        </blockquote>
        <Script async src="//www.instagram.com/embed.js" />
      </section>
    </div>
  );
}
