<template>
  <div class="lp-root">
    <!-- ===== NAVBAR ===== -->
    <nav class="lp-nav" :class="{ 'lp-nav--scrolled': scrolled }">
      <div class="lp-nav__inner">
        <div class="lp-nav__brand">
          <img src="/images/nurax_logo.png" alt="Nurax Logo" class="lp-nav__logo" />
          <span class="lp-nav__brand-name">Nurax</span>
        </div>
        <div class="lp-nav__links">
          <a href="#features" class="lp-nav__link">Funciones</a>
          <a href="#qr-scanner" class="lp-nav__link">Scanner QR</a>
          <a href="#stats" class="lp-nav__link">Resultados</a>
          <a href="#pricing" class="lp-nav__link">Precios</a>
          <a href="#contact" class="lp-nav__link">Contacto</a>
        </div>
        <a href="/auth/login" class="lp-btn lp-btn--fill lp-nav__cta">
          Iniciar Sesión →
        </a>
        <button class="lp-nav__hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      <!-- Mobile menu -->
      <div class="lp-nav__mobile" :class="{ 'lp-nav__mobile--open': mobileMenuOpen }">
        <a href="#features" @click="mobileMenuOpen=false">Funciones</a>
        <a href="#stats" @click="mobileMenuOpen=false">Resultados</a>
        <a href="#pricing" @click="mobileMenuOpen=false">Precios</a>
        <a href="#contact" @click="mobileMenuOpen=false">Contacto</a>
        <a href="/auth/login" class="lp-btn lp-btn--fill">Iniciar Sesión</a>
      </div>
    </nav>

    <!-- ===== HERO ===== -->
    <section class="lp-hero">
      <!-- Animated Mesh Gradient -->
      <div class="lp-mesh">
        <div class="lp-mesh__noise"></div>
        <div class="lp-mesh__orb lp-mesh__orb--1"></div>
        <div class="lp-mesh__orb lp-mesh__orb--2"></div>
        <div class="lp-mesh__orb lp-mesh__orb--3"></div>
        <div class="lp-mesh__orb lp-mesh__orb--4"></div>
        <div class="lp-mesh__orb lp-mesh__orb--5"></div>
      </div>
      <div class="lp-hero__content">
        <div class="lp-hero__text">
          <h1 class="lp-hero__title lp-reveal lp-reveal--hero">
            Deja de perder dinero.<br />
            <span class="lp-gradient-text">Controla todo</span> desde un solo lugar.
          </h1>
          <p class="lp-hero__desc lp-reveal lp-reveal--hero" style="transition-delay: 0.15s">
            Nurax es el sistema de inventario inteligente que pequeños y medianos negocios necesitan para crecer sin complicaciones. Ventas, stock, proveedores y reportes — todo en tiempo real.
          </p>
          <div class="lp-hero__actions lp-reveal lp-reveal--hero" style="transition-delay: 0.3s">
            <a href="/auth/login" class="lp-btn lp-btn--fill lp-btn--lg">
              Empezar gratis hoy
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#features" class="lp-btn lp-btn--outline lp-btn--lg">
              Ver cómo funciona
            </a>
          </div>
          <!-- <div class="lp-hero__trust">
            <div class="lp-trust-avatars">
              <img src="https://ui-avatars.com/api/?name=Ana+G&background=227d52&color=fff&size=40" alt="Ana" />
              <img src="https://ui-avatars.com/api/?name=Luis+M&background=06402b&color=fff&size=40" alt="Luis" />
              <img src="https://ui-avatars.com/api/?name=Carla+R&background=4a9e6f&color=fff&size=40" alt="Carla" />
              <img src="https://ui-avatars.com/api/?name=Jorge+P&background=13452d&color=fff&size=40" alt="Jorge" />
            </div>
            <p class="lp-trust-text">+500 negocios ya confían en Nurax</p>
          </div> -->
        </div>
        <div class="lp-hero__visual">
          <div class="lp-hero__img-wrapper">
            <img src="/images/hero_dashboard.png" alt="Dashboard Nurax" class="lp-hero__img" />
            <!-- Floating cards -->
            <div class="lp-float-card lp-float-card--1">
              <span class="lp-float-icon">📦</span>
              <div>
                <p class="lp-float-num">1,284</p>
                <p class="lp-float-label">Productos activos</p>
              </div>
            </div>
            <div class="lp-float-card lp-float-card--2">
              <span class="lp-float-icon">💰</span>
              <div>
                <p class="lp-float-num">$48,200</p>
                <p class="lp-float-label">Ventas este mes</p>
              </div>
            </div>
            <div class="lp-float-card lp-float-card--3">
              <span class="lp-float-icon">✅</span>
              <div>
                <p class="lp-float-num">99.9%</p>
                <p class="lp-float-label">Uptime garantizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== LOGOS BAND ===== -->
    <!-- <section class="lp-logos">
      <p class="lp-logos__label">Negocios que ya despegaron con Nurax</p>
      <div class="lp-logos__track">
        <span class="lp-logo-chip">🏪 TiendaMax</span>
        <span class="lp-logo-chip">🍕 PizzaRápida</span>
        <span class="lp-logo-chip">🛍️ MercadoPro</span>
        <span class="lp-logo-chip">🔧 TecnoFix</span>
        <span class="lp-logo-chip">💊 FarmaExpress</span>
        <span class="lp-logo-chip">👗 ModaClick</span>
        <span class="lp-logo-chip">🍔 BurgerBros</span>
        <span class="lp-logo-chip">🏋️ GymStore</span>
        <span class="lp-logo-chip">🌱 EcoMarket</span>
      </div>
    </section> -->

    <!-- ===== FEATURES ===== -->
    <section class="lp-features" id="features">
      <div class="lp-section-header lp-reveal">
        <h2 class="lp-section-title">Todo lo que tu negocio necesita,<br /><span class="lp-gradient-text">sin complicaciones</span></h2>
        <p class="lp-section-desc">Diseñado para que cualquier persona pueda usarlo desde el primer día, sin necesitar ser experto en tecnología.</p>
      </div>
      <div class="lp-features__grid">

        <!-- Feature 1: Inventario -->
        <div class="lp-feature-card lp-feature-card--wide lp-reveal">
          <div class="lp-feature-card__body">
            <span class="lp-feature-icon"></span>
            <h3 class="lp-feature-title">Inventario en tiempo real</h3>
            <p class="lp-feature-desc">Nunca más te quedes sin stock sin saberlo. Nurax monitorea cada producto, te avisa cuando el stock baja y te ayuda a reponer antes de perder ventas.</p>
            <ul class="lp-feature-list">
              <li>✓ Alertas automáticas de stock bajo</li>
              <li>✓ Escaneo de código de barras</li>
              <li>✓ Importación desde Excel</li>
              <li>✓ Categorías y SKU automáticos</li>
            </ul>
          </div>
          <div class="lp-feature-card__img">
            <img src="/images/feature_inventory.png" alt="Inventario" />
          </div>
        </div>

        <!-- Feature 2: Ventas -->
        <div class="lp-feature-card lp-feature-card--wide lp-feature-card--reverse lp-reveal">
          <div class="lp-feature-card__body">
            <span class="lp-feature-icon"></span>
            <h3 class="lp-feature-title">Ventas ultra rápidas</h3>
            <p class="lp-feature-desc">Registra ventas en segundos con nuestro sistema de punto de venta inteligente. Tu equipo lo aprende en minutos y tus clientes notan la diferencia.</p>
            <ul class="lp-feature-list">
              <li>✓ Registro de venta en 1 click</li>
              <li>✓ Historial completo de ventas</li>
              <li>✓ Cancelación y reembolso fácil</li>
              <li>✓ Ticket con sonido de éxito 🔔</li>
            </ul>
          </div>
          <div class="lp-feature-card__img">
            <img src="/images/feature_sales.png" alt="Ventas" />
          </div>
        </div>

        <!-- Feature 3: Proveedores -->
        <div class="lp-feature-card lp-feature-card--wide lp-reveal">
          <div class="lp-feature-card__body">
            <span class="lp-feature-icon"> </span>
            <h3 class="lp-feature-title">Gestión de proveedores</h3>
            <p class="lp-feature-desc">Ten todos tus proveedores organizados en un solo lugar. Contactos, productos que ofrecen, historial de compras — todo al alcance de un clic.</p>
            <ul class="lp-feature-list">
              <li>✓ Directorio de proveedores</li>
              <li>✓ Enlace productos ↔ proveedor</li>
              <li>✓ Datos de contacto siempre listos</li>
              <li>✓ Búsqueda y filtros avanzados</li>
            </ul>
          </div>
          <div class="lp-feature-card__img">
            <img src="/images/feature_suppliers.png" alt="Proveedores" />
          </div>
        </div>

      </div>

      <!-- Mini features grid -->
      <div class="lp-mini-features">
        <div class="lp-mini-card lp-reveal" v-for="(mf, idx) in miniFeatures" :key="mf.title" :style="{ transitionDelay: (idx * 0.08) + 's' }">
          <span class="lp-mini-icon">{{ mf.icon }}</span>
          <h4 class="lp-mini-title">{{ mf.title }}</h4>
          <p class="lp-mini-desc">{{ mf.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ===== QR SCANNER ===== -->
    <section class="lp-qr" id="qr-scanner">
      <div class="lp-qr__bg">
        <div class="lp-qr__particle" v-for="n in 18" :key="n" :style="qrParticleStyle(n)"></div>
      </div>

      <div class="lp-qr__inner">
        <!-- Left: Copy -->
        <div class="lp-qr__copy">
          <h2 class="lp-qr__title">
            Escanea.
            <span class="lp-qr__title--glow">Vende.</span>
            <br />Listo.
          </h2>
          <p class="lp-qr__desc">
            Convierte tu móvil en una pistola de escaneo profesional. Apunta la cámara a cualquier código QR o de barras y el producto aparece en pantalla al instante — sin teclear nada.
          </p>

          <div class="lp-qr__steps">
            <div class="lp-qr__step" v-for="(qs, i) in qrSteps" :key="i" :class="{ 'lp-qr__step--active': qrActiveStep === i }">
              <div class="lp-qr__step-num">{{ i + 1 }}</div>
              <div>
                <p class="lp-qr__step-title">{{ qs.title }}</p>
                <p class="lp-qr__step-desc">{{ qs.desc }}</p>
              </div>
            </div>
          </div>

          <div class="lp-qr__chips">
            <span class="lp-qr__chip" v-for="chip in qrChips" :key="chip.label">
              <span class="lp-qr__chip-icon">{{ chip.icon }}</span>
              {{ chip.label }}
            </span>
          </div>

          <a href="/auth/login" class="lp-btn lp-btn--neon lp-btn--lg">
            🚀 Probar scanner gratis
          </a>
        </div>

        <!-- Right: Phone mockup -->
        <div class="lp-qr__phone-wrap">
          <!-- Glow behind phone -->
          <div class="lp-qr__glow"></div>

          <div class="lp-phone">
            <!-- Phone shell -->
            <div class="lp-phone__shell">
              <div class="lp-phone__notch"></div>
              <div class="lp-phone__screen">

                <!-- SCAN STATE -->
                <Transition name="qr-fade">
                  <div v-if="qrScanState === 'scanning'" class="lp-phone__scanner">
                    <div class="lp-scanner__header">
                      <span class="lp-scanner__back">←</span>
                      <span class="lp-scanner__label">Escaneando QR</span>
                      <span class="lp-scanner__flash">⚡</span>
                    </div>
                    <!-- Camera viewfinder -->
                    <div class="lp-scanner__viewport">
                      <div class="lp-scanner__frame">
                        <span class="lp-scanner__corner lp-scanner__corner--tl"></span>
                        <span class="lp-scanner__corner lp-scanner__corner--tr"></span>
                        <span class="lp-scanner__corner lp-scanner__corner--bl"></span>
                        <span class="lp-scanner__corner lp-scanner__corner--br"></span>
                        <!-- Laser line -->
                        <div class="lp-scanner__laser"></div>
                        <!-- QR Code visual -->
                        <div class="lp-scanner__qr-img">
                          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" opacity="0.85">
                            <rect x="5" y="5" width="35" height="35" rx="4" fill="none" stroke="#fff" stroke-width="4"/>
                            <rect x="13" y="13" width="19" height="19" rx="2" fill="#fff"/>
                            <rect x="60" y="5" width="35" height="35" rx="4" fill="none" stroke="#fff" stroke-width="4"/>
                            <rect x="68" y="13" width="19" height="19" rx="2" fill="#fff"/>
                            <rect x="5" y="60" width="35" height="35" rx="4" fill="none" stroke="#fff" stroke-width="4"/>
                            <rect x="13" y="68" width="19" height="19" rx="2" fill="#fff"/>
                            <rect x="58" y="58" width="9" height="9" fill="#fff"/>
                            <rect x="70" y="58" width="9" height="9" fill="#fff"/>
                            <rect x="82" y="58" width="13" height="9" fill="#fff"/>
                            <rect x="58" y="70" width="9" height="9" fill="#fff"/>
                            <rect x="70" y="70" width="22" height="9" fill="#fff"/>
                            <rect x="82" y="82" width="13" height="13" fill="#fff"/>
                            <rect x="58" y="82" width="9" height="13" fill="#fff"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p class="lp-scanner__hint">Apunta al código QR del producto</p>
                  </div>
                </Transition>

                <!-- FOUND STATE -->
                <Transition name="qr-fade">
                  <div v-if="qrScanState === 'found'" class="lp-phone__found">
                    <div class="lp-found__check">✓</div>
                    <p class="lp-found__product">{{ qrProduct.name }}</p>
                    <p class="lp-found__sku">SKU: {{ qrProduct.sku }}</p>
                    <div class="lp-found__row">
                      <span class="lp-found__price">{{ qrProduct.price }}</span>
                      <span class="lp-found__stock">Stock: {{ qrProduct.stock }}</span>
                    </div>
                    <div class="lp-found__bar">
                      <div class="lp-found__bar-fill"></div>
                    </div>
                    <p class="lp-found__adding">Agregando a la venta...</p>
                  </div>
                </Transition>

                <!-- SUCCESS STATE -->
                <Transition name="qr-fade">
                  <div v-if="qrScanState === 'success'" class="lp-phone__success">
                    <div class="lp-success__ring">
                      <span class="lp-success__icon">💰</span>
                    </div>
                    <p class="lp-success__label">¡Venta registrada!</p>
                    <div class="lp-success__receipt">
                      <div class="lp-receipt__row" v-for="item in saleItems" :key="item.name">
                        <span>{{ item.name }}</span>
                        <span>{{ item.price }}</span>
                      </div>
                      <div class="lp-receipt__total">
                        <span>Total</span>
                        <span>{{ saleTotal }}</span>
                      </div>
                    </div>
                    <p class="lp-success__time">Registrado en <strong>1.2s</strong></p>
                  </div>
                </Transition>

              </div>
              <div class="lp-phone__home-bar"></div>
            </div>
          </div>

          <!-- Floating stats -->
          <div class="lp-qr__stat lp-qr__stat--1">
            <span class="lp-qr__stat-icon">⚡</span>
            <div>
              <p class="lp-qr__stat-num">1.2s</p>
              <p class="lp-qr__stat-lbl">Por escaneo</p>
            </div>
          </div>
          <div class="lp-qr__stat lp-qr__stat--2">
            <span class="lp-qr__stat-icon">📦</span>
            <div>
              <p class="lp-qr__stat-num">∞</p>
              <p class="lp-qr__stat-lbl">Productos</p>
            </div>
          </div>
          <div class="lp-qr__stat lp-qr__stat--3">
            <span class="lp-qr__stat-icon">🎯</span>
            <div>
              <p class="lp-qr__stat-num">99%</p>
              <p class="lp-qr__stat-lbl">Precisión</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="lp-stats" id="stats">
      <div class="lp-stats__inner">
        <div class="lp-stats__text lp-reveal">
          <h2 class="lp-stats__title">Números que hablan<br /><span class="lp-gradient-text">por sí solos</span></h2>
          <p class="lp-stats__desc">Los negocios que usan Nurax reportan mejoras significativas en su operación desde el primer mes de uso.</p>
          <a href="/auth/login" class="lp-btn lp-btn--fill lp-btn--lg" style="margin-top:2rem;">
            Quiero estos resultados
          </a>
        </div>
        <div class="lp-stats__cards">
          <div class="lp-stat-card lp-reveal" v-for="(s, idx) in stats" :key="s.label" :style="{ transitionDelay: (idx * 0.1) + 's' }">
            <span class="lp-stat-icon">{{ s.icon }}</span>
            <p class="lp-stat-num">{{ s.num }}</p>
            <p class="lp-stat-label">{{ s.label }}</p>
          </div>
        </div>
        <div class="lp-stats__img">
          <img src="/images/feature_inventory.png" alt="Crecimiento" />
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="lp-how">
      <div class="lp-section-header lp-reveal">
        <h2 class="lp-section-title">Empieza a vender<br /><span class="lp-gradient-text">en 3 pasos</span></h2>
      </div>
      <div class="lp-how__steps">
        <div class="lp-step lp-reveal" v-for="(step, i) in steps" :key="i" :style="{ transitionDelay: (i * 0.15) + 's' }">
          <div class="lp-step__num">{{ i + 1 }}</div>
          <span class="lp-step__icon">{{ step.icon }}</span>
          <h3 class="lp-step__title">{{ step.title }}</h3>
          <p class="lp-step__desc">{{ step.desc }}</p>
          <div v-if="i < steps.length - 1" class="lp-step__connector">→</div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <!-- <section class="lp-testimonials" id="testimonials">
      <div class="lp-section-header">
        <h2 class="lp-section-title">Lo que dicen<br /><span class="lp-gradient-text">nuestros clientes</span></h2>
      </div>
      <div class="lp-testimonials__grid">
        <div class="lp-testimonial-card" v-for="t in testimonials" :key="t.name">
          <div class="lp-testimonial-stars">⭐⭐⭐⭐⭐</div>
          <p class="lp-testimonial-text">"{{ t.text }}"</p>
          <div class="lp-testimonial-author">
            <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=227d52&color=fff&size=48`" :alt="t.name" />
            <div>
              <p class="lp-testimonial-name">{{ t.name }}</p>
              <p class="lp-testimonial-role">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- ===== PRICING ===== -->
    <!-- <section class="lp-pricing" id="pricing">
      <div class="lp-section-header">
        <span class="lp-badge lp-badge--dark">💎 Planes</span>
        <h2 class="lp-section-title">Elige el plan<br /><span class="lp-gradient-text">perfecto para ti</span></h2>
        <p class="lp-section-desc">Sin letras pequeñas. Sin sorpresas. Cancel cuando quieras.</p>
      </div>
      <div class="lp-pricing__grid">
        <div class="lp-price-card" v-for="plan in plans" :key="plan.name" :class="{ 'lp-price-card--featured': plan.featured }">
          <span v-if="plan.featured" class="lp-price-badge">⭐ Más popular</span>
          <h3 class="lp-price-name">{{ plan.name }}</h3>
          <div class="lp-price-amount">
            <span class="lp-price-currency">$</span>
            <span class="lp-price-num">{{ plan.price }}</span>
            <span class="lp-price-period">/mes</span>
          </div>
          <p class="lp-price-desc">{{ plan.desc }}</p>
          <ul class="lp-price-features">
            <li v-for="f in plan.features" :key="f">✓ {{ f }}</li>
          </ul>
          <a href="/auth/login" :class="['lp-btn', 'lp-btn--lg', plan.featured ? 'lp-btn--fill' : 'lp-btn--outline']" style="width:100%;text-align:center;">
            {{ plan.featured ? '🚀 Comenzar ahora' : 'Seleccionar plan' }}
          </a>
        </div>
      </div>
    </section> -->

    <!-- ===== DEVELOPER CONTACT & COMMENTS ===== -->
    <section class="lp-developer" id="contact">
      <div class="lp-developer__inner lp-reveal">
        <div class="lp-developer__profile">
          <img src="/images/uziel_avatar.jpg" alt="Uziel Tzab" class="lp-developer__avatar" />
          <h3 class="lp-developer__name">Uziel Tzab</h3>
          <p class="lp-developer__role">Creador & Desarrollador Principal</p>
          <p class="lp-developer__quote">
            "Mi compromiso es brindarte una herramienta sólida que impulse el crecimiento de tu negocio. Si Nurax resuena con lo que necesitas, me encantaría escucharte y ayudarte personalmente a implementarlo."
          </p>
          <div class="lp-developer__actions">
            <!-- WhatsApp Button -->
            <a href="https://wa.me/529992460093?text=Hola%20Uziel,%20estoy%20interesado%20en%20Nurax" target="_blank" class="lp-btn lp-btn--whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
              Chat en WhatsApp
            </a>
            <!-- Email -->
            <a href="mailto:uzieltzab8@gmail.com" class="lp-btn lp-btn--outline">
              uzieltzab8@gmail.com
            </a>
          </div>
        </div>

        <div class="lp-developer__forms">
          <!-- Contact Form -->
          <div class="lp-contact-form">
            <h4 class="lp-form-title">Envíame un mensaje</h4>
            <form @submit.prevent="submitContactForm">
              <input type="text" placeholder="Tu nombre" required class="lp-input" />
              <input type="email" placeholder="Tu correo electrónico" required class="lp-input" />
              <textarea placeholder="¿En qué te puedo ayudar?" required class="lp-input lp-textarea"></textarea>
              <button type="submit" class="lp-btn lp-btn--fill" style="width: 100%; justify-content: center;">Enviar Mensaje</button>
            </form>
            <p v-if="contactSuccess" class="lp-form-success">¡Mensaje enviado con éxito! Te responderé pronto.</p>
          </div>

          <!-- Comments Section -->
          <div class="lp-comments">
            <h4 class="lp-form-title">Zona de Comentarios</h4>
            <div class="lp-comments-list">
              <div v-for="(comment, index) in comments" :key="index" class="lp-comment-item">
                <span class="lp-comment-author">{{ comment.author }}</span>
                <p class="lp-comment-text">{{ comment.text }}</p>
              </div>
            </div>
            <form @submit.prevent="submitComment" class="lp-comment-form">
              <input type="text" v-model="newCommentAuthor" placeholder="Tu nombre" required class="lp-input lp-input--sm" />
              <textarea v-model="newCommentText" placeholder="Escribe un comentario..." required class="lp-input lp-textarea--sm"></textarea>
              <button type="submit" class="lp-btn lp-btn--outline" style="width: 100%; justify-content: center; padding: 0.5rem 1rem; font-size: 0.85rem;">Publicar Comentario</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="lp-cta">
      <div class="lp-cta__inner">
        <div class="lp-blob lp-blob--cta1"></div>
        <div class="lp-blob lp-blob--cta2"></div>
        <h2 class="lp-cta__title lp-reveal">¿Listo para transformar<br />tu negocio hoy?</h2>
        <p class="lp-cta__desc lp-reveal" style="transition-delay: 0.1s">Únete a más negocios que ya dejaron de perder tiempo y dinero con hojas de cálculo desactualizadas.</p>
        <a href="/auth/login" class="lp-btn lp-btn--white lp-btn--lg lp-reveal" style="transition-delay: 0.2s">
          🎉 Empieza gratis — sin tarjeta de crédito
        </a>
        <p class="lp-cta__footnote">14 días gratis · Sin compromiso · Cancela cuando quieras</p>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="lp-footer">
      <div class="lp-footer__inner">
        <div class="lp-footer__brand">
          <img src="/images/nurax_logo_app_192.png" alt="Nurax" class="lp-footer__logo" />
          <span class="lp-footer__name">Nurax</span>
          <p class="lp-footer__tagline">Gestión inteligente para negocios inteligentes.</p>
        </div>
        <div class="lp-footer__links">
          <div class="lp-footer__col">
            <p class="lp-footer__col-title">Producto</p>
            <a href="#features">Funciones</a>
            <a href="#pricing">Precios</a>
            <a href="#stats">Resultados</a>
          </div>
          <div class="lp-footer__col">
            <p class="lp-footer__col-title">Empresa</p>
            <a href="#">Sobre nosotros</a>
            <a href="#">Blog</a>
            <a href="#">Contacto</a>
          </div>
          <div class="lp-footer__col">
            <p class="lp-footer__col-title">Legal</p>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
          </div>
        </div>
      </div>
      <div class="lp-footer__bottom">
        <p>© 2026 Onux Systems. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => { scrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// ---- Scroll Reveal (IntersectionObserver) ----
let revealObserver: IntersectionObserver | null = null

onMounted(async () => {
  await nextTick()
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lp-revealed')
          revealObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.lp-reveal').forEach((el) => {
    revealObserver?.observe(el)
  })
})
onUnmounted(() => revealObserver?.disconnect())

// ---- QR Scanner demo ----
const qrScanState = ref<'scanning' | 'found' | 'success'>('scanning')
const qrActiveStep = ref(0)

const qrProduct = { name: 'Audífonos Bluetooth Pro', sku: 'AUD-BT-042', price: '$1,299', stock: 14 }
const saleItems = [
  { name: 'Audífonos BT Pro', price: '$1,299' },
  { name: 'Funda protectora',  price: '$199' },
]
const saleTotal = '$1,498'

let qrTimer: ReturnType<typeof setInterval>
const cycleQr = () => {
  // scanning → found → success → scanning
  if (qrScanState.value === 'scanning') {
    qrScanState.value = 'found'
    qrActiveStep.value = 1
  } else if (qrScanState.value === 'found') {
    qrScanState.value = 'success'
    qrActiveStep.value = 2
  } else {
    qrScanState.value = 'scanning'
    qrActiveStep.value = 0
  }
}

const qrParticleStyle = (n: number) => ({
  left: `${(n * 37) % 100}%`,
  top: `${(n * 53) % 100}%`,
  width: `${4 + (n % 5) * 3}px`,
  height: `${4 + (n % 5) * 3}px`,
  animationDelay: `${(n * 0.37) % 4}s`,
  animationDuration: `${3 + (n % 4)}s`,
})

const qrSteps = [
  { title: 'Abre el scanner',      desc: 'Un clic desde el dashboard o la app.' },
  { title: 'Apunta la cámara',     desc: 'Detecta QR y códigos de barras automáticamente.' },
  { title: 'Venta registrada',     desc: 'El producto se agrega y el stock se actualiza al instante.' },
]
const qrChips = [
  { icon: '📷', label: 'Sin hardware extra' },
  { icon: '⚡', label: 'Ventas en 1 segundo' },
  { icon: '🔄', label: 'Stock en tiempo real' },
]

onMounted(() => { qrTimer = setInterval(cycleQr, 2400) })
onUnmounted(() => clearInterval(qrTimer))

const miniFeatures = [
  { icon: '📊', title: 'Reportes detallados', desc: 'Visualiza el rendimiento de tu negocio con gráficas claras y en tiempo real.' },
  { icon: '🔔', title: 'Alertas inteligentes', desc: 'Nunca más olvides pedir mercancía. Las alertas te avisan antes de que sea tarde.' },
  { icon: '📱', title: 'Scanner QR móvil', desc: 'Escanea productos con la cámara de tu teléfono. Sin hardware, sin complicaciones.' },
  { icon: '🔒', title: 'Seguridad garantizada', desc: 'Tus datos están protegidos con cifrado de nivel bancario.' },
  { icon: '📤', title: 'Exportar a Excel', desc: 'Descarga tu inventario en Excel con un solo clic para análisis externos.' },
  { icon: '🤝', title: 'Soporte prioritario', desc: 'Nuestro equipo está disponible para ayudarte cuando lo necesites.' },
]

const stats = [
  { icon: '⏱️', num: '80%', label: 'Menos tiempo en inventario' },
  { icon: '📈', num: '3x', label: 'Más ventas registradas' },
  { icon: '💸', num: '$12K', label: 'Ahorro promedio mensual' },
  { icon: '🚀', num: '2 min', label: 'Para empezar a usarlo' },
]

const steps = [
  { icon: '📝', title: 'Crea tu cuenta', desc: 'Regístrate gratis en menos de 2 minutos. Sin tarjeta necesaria.' },
  { icon: '📦', title: 'Carga tu inventario', desc: 'Agrega productos uno a uno o importa desde tu Excel existente.' },
  { icon: '💰', title: '¡Empieza a vender!', desc: 'Registra ventas, controla stock y haz crecer tu negocio desde el primer día.' },
]

// ---- Contact & Comments ----
const contactSuccess = ref(false)
const submitContactForm = () => {
  setTimeout(() => {
    contactSuccess.value = true
    setTimeout(() => { contactSuccess.value = false }, 4000)
  }, 600)
}

const comments = ref([
  { author: 'Juan P.', text: 'Se ve prometedor el sistema, me interesa para mi tienda.' },
  { author: 'Ana López', text: '¿Tienen planes de integrar facturación electrónica pronto?' }
])
const newCommentAuthor = ref('')
const newCommentText = ref('')

const submitComment = () => {
  if (newCommentAuthor.value.trim() && newCommentText.value.trim()) {
    comments.value.push({
      author: newCommentAuthor.value.trim(),
      text: newCommentText.value.trim()
    })
    newCommentAuthor.value = ''
    newCommentText.value = ''
  }
}

/*
const testimonials = [
  { name: 'María García', role: 'Dueña de Tienda de Ropa', text: 'Antes usaba Excel y siempre tenía errores. Con Nurax controlo todo desde el celular y mis ventas aumentaron 40% porque nunca me quedo sin stock.' },
  { name: 'Carlos Mendoza', role: 'Restaurantero', text: 'Increíble cómo algo tan complejo puede ser tan simple. Mis empleados aprendieron en una hora y el control de insumos es perfecto.' },
  { name: 'Ana Rodríguez', role: 'Farmacéutica', text: 'La alerta de stock bajo me ha salvado mil veces. Ya no pierdo clientes por falta de producto. ¡Vale cada peso!' },
  { name: 'Roberto Pérez', role: 'Mayorista', text: 'El módulo de proveedores es genial. Tengo todos mis contactos organizados y sé exactamente qué le compro a cada quien.' },
  { name: 'Lucía Torres', role: 'Papelería', text: 'Pensé que era difícil de usar pero me sorprendió. En 2 días tenía todo mi inventario cargado y el sistema funcionando perfecto.' },
  { name: 'Eduardo Sánchez', role: 'Ferretería', text: 'Los reportes de ventas me permiten tomar mejores decisiones. Por fin sé qué productos me dejan más ganancia.' },
]

const plans = [
  {
    name: 'Básico',
    price: '0',
    desc: 'Perfecto para comenzar',
    featured: false,
    features: ['Hasta 100 productos', '50 ventas al mes', 'Soporte por email', '1 usuario'],
  },
  {
    name: 'Profesional',
    price: '299',
    desc: 'El favorito de los negocios en crecimiento',
    featured: true,
    features: ['Productos ilimitados', 'Ventas ilimitadas', 'Proveedores ilimitados', 'Exportar Excel', 'Soporte prioritario', 'Hasta 5 usuarios', 'Reportes avanzados'],
  },
  {
    name: 'Empresarial',
    price: '699',
    desc: 'Para negocios con operaciones complejas',
    featured: false,
    features: ['Todo lo de Profesional', 'Usuarios ilimitados', 'API access', 'Onboarding dedicado', 'SLA garantizado 99.9%'],
  },
]
*/
</script>

<style scoped>
/* ========================
   ROOT & GLOBAL — Minimalist
======================== */
.lp-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #fafafa;
  color: #1a1a1a;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ========================
   UTILS
======================== */
.lp-gradient-text {
  background: linear-gradient(135deg, #1a6b42 0%, #0d4a2e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lp-badge {
  display: inline-block;
  background: #f0f7f3;
  color: #1a6b42;
  border: 1px solid #dceee4;
  border-radius: 35x;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.3rem 0.875rem;
  letter-spacing: 0.03em;
}
.lp-badge--dark {
  background: #0d4a2e;
  color: #ffffff;
  border-color: transparent;
}
.lp-badge--light {
  background: rgba(255,255,255,0.15);
  color: #ffffff;
  border-color: rgba(255,255,255,0.2);
}

/* Buttons — with fill-sweep animation */
.lp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.75rem 1.75rem;
  border-radius: 35px;
  text-decoration: none;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition:
    color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
/* Sweep pseudo-element */
.lp-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
}
.lp-btn:hover::before {
  transform: scaleX(1);
}

/* Icon animations */
.lp-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.lp-btn:hover svg {
  transform: translateX(3px) rotate(-45deg);
}

/* ---- Fill variant ---- */
.lp-btn--fill {
  background: #0d4a2e;
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.lp-btn--fill::before {
  background: linear-gradient(135deg, #1a6b42, #22875a);
}
.lp-btn--fill:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(13,74,46,0.25);
}

/* ---- Outline variant — dramatic fill sweep ---- */
.lp-btn--outline {
  background: transparent;
  color: #0d4a2e;
  border: 1.5px solid #b8d5c4;
}
.lp-btn--outline::before {
  background: #0d4a2e;
}
.lp-btn--outline:hover {
  color: #fff;
  border-color: #0d4a2e;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(13,74,46,0.2);
}

/* ---- White variant ---- */
.lp-btn--white {
  background: #fff;
  color: #0d4a2e;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.lp-btn--white::before {
  background: linear-gradient(135deg, #f0faf5, #e0f2ea);
}
.lp-btn--white:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
}
.lp-btn--white:hover svg {
  transform: translateX(3px) rotate(-45deg);
}

.lp-btn--lg { font-size: 1rem; padding: 0.875rem 2rem; }

/* Blobs — much softer */
.lp-blob {
  position: absolute;
  border-radius: 35%;
  filter: blur(100px);
  pointer-events: none;
  opacity: 0.5;
}

/* Section header */
.lp-section-header {
  text-align: center;
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.lp-section-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 600;
  color: #111;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}
.lp-section-desc {
  font-size: 1.0625rem;
  color: #71717a;
  max-width: 520px;
  line-height: 1.7;
  margin: 0;
}

/* ========================
   NAVBAR — clean & airy
======================== */
.lp-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.25rem 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.lp-nav--scrolled {
  background: rgba(250,250,250,0.85);
  backdrop-filter: blur(20px) saturate(1.2);
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
  padding: 0.75rem 0;
}
.lp-nav__inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.lp-nav__brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  flex-shrink: 0;
}
.lp-nav__logo { width: 32px; height: 32px; object-fit: contain; }
.lp-nav__brand-name { font-size: 1.125rem; font-weight: 600; color: #0d4a2e; letter-spacing: -0.3px; }
.lp-nav__links { display: flex; align-items: center; gap: 0.125rem; margin-left: auto; }
.lp-nav__link {
  font-size: 0.875rem;
  font-weight: 400;
  color: #52525b;
  text-decoration: none;
  padding: 0.5rem 0.875rem;
  border-radius: 35x;
  transition: all 0.25s;
}
.lp-nav__link:hover { color: #0d4a2e; background: rgba(13,74,46,0.04); }
.lp-nav__cta { margin-left: 1rem; font-size: 0.8125rem; padding: 0.55rem 1.25rem; }
.lp-nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
}
.lp-nav__hamburger span { width: 20px; height: 1.5px; background: #3f3f46; border-radius: 35x; display: block; transition: all 0.3s; }
.lp-nav__mobile {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}
.lp-nav__mobile.lp-nav__mobile--open { display: flex; }
.lp-nav__mobile a:not(.lp-btn) { color: #3f3f46; text-decoration: none; font-weight: 400; font-size: 0.9375rem; padding: 0.5rem 0; }

/* ========================
   HERO — clean, centered feel
======================== */
.lp-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #fafafa;
  overflow: hidden;
  padding-top: 80px;
}

/* ---- Animated Mesh Gradient (Aurora) ---- */
.lp-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.lp-mesh__noise {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.03;
  z-index: 1;
}
.lp-mesh__orb {
  position: absolute;
  border-radius: 35%;
  filter: blur(80px);
  mix-blend-mode: normal;
}
.lp-mesh__orb--1 {
  width: 55vw;
  height: 55vw;
  max-width: 700px;
  max-height: 700px;
  background: radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%);
  top: -20%;
  right: -15%;
  animation: meshDrift1 18s ease-in-out infinite;
}
.lp-mesh__orb--2 {
  width: 45vw;
  height: 45vw;
  max-width: 550px;
  max-height: 550px;
  background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
  bottom: -10%;
  left: -10%;
  animation: meshDrift2 22s ease-in-out infinite;
}
.lp-mesh__orb--3 {
  width: 35vw;
  height: 35vw;
  max-width: 420px;
  max-height: 420px;
  background: radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);
  top: 30%;
  left: 35%;
  animation: meshDrift3 15s ease-in-out infinite;
}
.lp-mesh__orb--4 {
  width: 30vw;
  height: 30vw;
  max-width: 380px;
  max-height: 380px;
  background: radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%);
  top: 10%;
  left: 60%;
  animation: meshDrift4 20s ease-in-out infinite;
}
.lp-mesh__orb--5 {
  width: 25vw;
  height: 25vw;
  max-width: 300px;
  max-height: 300px;
  background: radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%);
  bottom: 20%;
  right: 25%;
  animation: meshDrift5 25s ease-in-out infinite;
}
@keyframes meshDrift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%      { transform: translate(-40px, 30px) scale(1.08); }
  50%      { transform: translate(20px, -20px) scale(0.95); }
  75%      { transform: translate(30px, 40px) scale(1.05); }
}
@keyframes meshDrift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(50px, -30px) scale(1.1); }
  66%      { transform: translate(-30px, 20px) scale(0.92); }
}
@keyframes meshDrift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  20%      { transform: translate(-25px, -40px) scale(1.12); }
  40%      { transform: translate(40px, 10px) scale(0.9); }
  60%      { transform: translate(-10px, 35px) scale(1.06); }
  80%      { transform: translate(30px, -15px) scale(0.95); }
}
@keyframes meshDrift4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-35px, 25px) scale(1.15); }
}
@keyframes meshDrift5 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  30%      { transform: translate(20px, -35px) scale(1.1); }
  70%      { transform: translate(-25px, 20px) scale(0.93); }
}
@keyframes blobPulse { from { transform: scale(1); } to { transform: scale(1.1); } }

.lp-hero__content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 5rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  position: relative;
  z-index: 2;
}
.lp-hero__text {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.lp-hero__title {
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 600;
  color: #111;
  margin: 0;
  line-height: 1.12;
  letter-spacing: -1.2px;
}
.lp-hero__desc {
  font-size: 1.0625rem;
  color: #71717a;
  line-height: 1.75;
  margin: 0;
  max-width: 480px;
}
.lp-hero__actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.lp-hero__trust {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-top: 0.5rem;
}
.lp-trust-avatars { display: flex; }
.lp-trust-avatars img {
  width: 36px; height: 36px;
  border-radius: 35%;
  border: 2px solid #fff;
  margin-left: -10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.lp-trust-avatars img:first-child { margin-left: 0; }
.lp-trust-text { font-size: 0.875rem; color: #71717a; font-weight: 400; }

/* Hero visual */
.lp-hero__visual { position: relative; }
.lp-hero__img-wrapper {
  position: relative;
  animation: gentleFloat 6s ease-in-out infinite;
}
@keyframes gentleFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.lp-hero__img {
  width: 100%;
  max-width: 520px;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.08));
  display: block;
  mix-blend-mode: multiply;
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 82%);
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 82%);
}

/* Float cards — cleaner */
.lp-float-card {
  position: absolute;
  background: #fff;
  border-radius: 35px;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: gentleFloat 5s ease-in-out infinite;
}
.lp-float-card--1 { top: 10%; right: -1rem; animation-delay: 0s; }
.lp-float-card--2 { bottom: 20%; left: -2rem; animation-delay: 1.5s; }
.lp-float-card--3 { bottom: 5%; right: 5%; animation-delay: 3s; }
@keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.lp-float-icon { font-size: 1.5rem; }
.lp-float-num { font-size: 1rem; font-weight: 600; color: #111; margin: 0; line-height: 1; }
.lp-float-label { font-size: 0.7rem; color: #a1a1aa; margin: 0.125rem 0 0; letter-spacing: 0.02em; }

/* ========================
   LOGOS BAND
======================== */
.lp-logos {
  padding: 2rem 0;
  background: #0d4a2e;
  overflow: hidden;
}
.lp-logos__label { text-align: center; color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 400; margin-bottom: 1.25rem; letter-spacing: 0.08em; text-transform: uppercase; }
.lp-logos__track { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; padding: 0 2rem; }
.lp-logo-chip { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); padding: 0.5rem 1.25rem; border-radius: 35x; font-size: 0.8125rem; font-weight: 400; border: 1px solid rgba(255,255,255,0.1); white-space: nowrap; }

/* ========================
   FEATURES — clean cards
======================== */
.lp-features {
  padding: 8rem 2rem;
  max-width: 1140px;
  margin: 0 auto;
}
.lp-features__grid { display: flex; flex-direction: column; gap: 3rem; margin-bottom: 5rem; }

.lp-feature-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  background: #fff;
  border-radius: 35px;
  padding: 3.5rem;
  border: 1px solid #ebebeb;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.lp-feature-card:hover {
  border-color: #d4e5dc;
  box-shadow: 0 8px 32px rgba(0,0,0,0.04);
  transform: translateY(-2px);
}
.lp-feature-card--reverse { direction: rtl; }
.lp-feature-card--reverse > * { direction: ltr; }

.lp-feature-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
.lp-feature-title { font-size: 1.75rem; font-weight: 600; color: #111; margin: 0 0 1rem; letter-spacing: -0.3px; }
.lp-feature-desc { font-size: 1rem; color: #71717a; line-height: 1.75; margin: 0 0 1.5rem; }
.lp-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.lp-feature-list li { font-size: 0.9rem; color: #1a6b42; font-weight: 500; }

.lp-feature-card__img { display: flex; justify-content: center; align-items: center; border-radius: 24px;}
.lp-feature-card__img img { width: 100%; max-width: 340px; object-fit: contain; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.06)); mix-blend-mode: multiply; border-radius: 35px; }

/* Mini features — clean grid */
.lp-mini-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}
.lp-mini-card {
  padding: 2rem;
  border: 1px solid #ebebeb;
  border-radius: 35px;
  background: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.lp-mini-card:hover {
  border-color: #d4e5dc;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  transform: translateY(-1px);
}
.lp-mini-icon { font-size: 1.75rem; display: block; margin-bottom: 0.875rem; }
.lp-mini-title { font-size: 1rem; font-weight: 600; color: #111; margin: 0 0 0.5rem; }
.lp-mini-desc { font-size: 0.875rem; color: #71717a; margin: 0; line-height: 1.65; }

/* ========================
   STATS — dark but clean
======================== */
.lp-stats {
  background: #111;
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
}
.lp-blob--cta1 { width: 400px; height: 400px; background: rgba(26,107,66,0.08); top: -100px; left: -100px; }
.lp-blob--cta2 { width: 300px; height: 300px; background: rgba(26,107,66,0.06); bottom: -80px; right: -80px; }
.lp-stats__inner {
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}
.lp-stats__text { display: flex; flex-direction: column; gap: 1.25rem; }
.lp-stats__title { font-size: clamp(1.75rem, 3.5vw, 2.5rem); font-weight: 600; color: #fff; margin: 0; line-height: 1.2; letter-spacing: -0.5px; }
.lp-stats__title .lp-gradient-text { background: linear-gradient(135deg,#86efac,#4ade80); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.lp-stats__desc { font-size: 1rem; color: rgba(255,255,255,0.5); line-height: 1.7; margin: 0; }

.lp-stats__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.lp-stat-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 35px;
  padding: 1.75rem;
  text-align: center;
  transition: all 0.3s;
}
.lp-stat-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
.lp-stat-icon { font-size: 1.5rem; display: block; margin-bottom: 0.625rem; }
.lp-stat-num { font-size: 1.875rem; font-weight: 600; color: #fff; margin: 0; line-height: 1; }
.lp-stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.45); margin: 0.375rem 0 0; font-weight: 400; }

.lp-stats__img { display: flex; justify-content: center; }
.lp-stats__img img { width: 260px; max-width: 100%; object-fit: contain; animation: gentleFloat 6s ease-in-out infinite; mix-blend-mode: luminosity; filter: brightness(1.1); opacity: 0.8; }

/* ========================
   HOW IT WORKS — spacious
======================== */
.lp-how { padding: 8rem 2rem; background: #fff; }
.lp-how__steps {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 0;
  position: relative;
}
.lp-step {
  flex: 1;
  text-align: center;
  padding: 2.5rem 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.lp-step__num {
  width: 48px; height: 48px;
  border-radius: 35px;
  background: #0d4a2e;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lp-step__icon { font-size: 2.5rem; }
.lp-step__title { font-size: 1.125rem; font-weight: 600; color: #111; margin: 0; }
.lp-step__desc { font-size: 0.875rem; color: #71717a; margin: 0; line-height: 1.65; }
.lp-step__connector {
  position: absolute;
  top: 4.5rem;
  right: -1rem;
  font-size: 1.25rem;
  color: #c8ddd1;
  z-index: 2;
  font-weight: 400;
}

/* ========================
   TESTIMONIALS
======================== */
.lp-testimonials { padding: 8rem 2rem; background: #fafafa; }
.lp-testimonials__grid {
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.25rem;
}
.lp-testimonial-card {
  padding: 2rem;
  border: 1px solid #ebebeb;
  border-radius: 35px;
  background: #fff;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.lp-testimonial-card:hover { border-color: #d4e5dc; transform: translateY(-1px); }
.lp-testimonial-stars { font-size: 0.9rem; }
.lp-testimonial-text { font-size: 0.9375rem; color: #52525b; line-height: 1.7; margin: 0; flex: 1; font-style: italic; }
.lp-testimonial-author { display: flex; align-items: center; gap: 0.875rem; }
.lp-testimonial-author img { width: 40px; height: 40px; border-radius: 35%; }
.lp-testimonial-name { font-weight: 600; font-size: 0.875rem; color: #111; margin: 0; }
.lp-testimonial-role { font-size: 0.8125rem; color: #a1a1aa; margin: 0.1rem 0 0; }

/* ========================
   PRICING
======================== */
.lp-pricing { padding: 8rem 2rem; background: #fff; }
.lp-pricing__grid {
  max-width: 1060px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.08fr 1fr;
  gap: 1.25rem;
  align-items: start;
}
.lp-price-card {
  padding: 2.5rem 2rem;
  border: 1px solid #ebebeb;
  border-radius: 35px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  transition: all 0.3s;
}
.lp-price-card:hover { border-color: #d4e5dc; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
.lp-price-card--featured {
  border-color: #0d4a2e;
  background: #0d4a2e;
  color: #fff;
  box-shadow: 0 12px 40px rgba(13,74,46,0.15);
  transform: scale(1.03);
}
.lp-price-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  color: #fff;
  padding: 0.25rem 0.875rem;
  border-radius: 35x;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 0.03em;
}
.lp-price-name { font-size: 1.125rem; font-weight: 600; margin: 0; }
.lp-price-card--featured .lp-price-name { color: #fff; }
.lp-price-amount { display: flex; align-items: baseline; gap: 0.25rem; }
.lp-price-currency { font-size: 1.25rem; font-weight: 600; color: #52525b; }
.lp-price-num { font-size: 2.75rem; font-weight: 600; color: #111; line-height: 1; }
.lp-price-period { font-size: 0.875rem; color: #a1a1aa; }
.lp-price-card--featured .lp-price-currency,
.lp-price-card--featured .lp-price-num { color: #fff; }
.lp-price-card--featured .lp-price-period { color: rgba(255,255,255,0.5); }
.lp-price-desc { font-size: 0.875rem; color: #71717a; margin: 0; }
.lp-price-card--featured .lp-price-desc { color: rgba(255,255,255,0.6); }
.lp-price-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.625rem; flex: 1; }
.lp-price-features li { font-size: 0.875rem; color: #52525b; font-weight: 400; }
.lp-price-card--featured .lp-price-features li { color: rgba(255,255,255,0.75); }

/* ========================
   CTA FINAL — subtle dark
======================== */
.lp-cta {
  background: #0d4a2e;
  padding: 8rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.lp-cta__inner { max-width: 640px; margin: 0 auto; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.lp-cta__title { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 600; color: #fff; margin: 0; line-height: 1.2; letter-spacing: -0.5px; }
.lp-cta__desc { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.7; margin: 0; }
.lp-cta__footnote { font-size: 0.8125rem; color: rgba(255,255,255,0.35); margin: 0; }

/* ========================
   FOOTER — minimal dark
======================== */
.lp-footer { background: #111; padding: 4rem 2rem 0; }
.lp-footer__inner {
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.lp-footer__brand { display: flex; flex-direction: column; gap: 0.75rem; }
.lp-footer__logo { width: 36px; height: 36px; object-fit: contain; }
.lp-footer__name { font-size: 1.25rem; font-weight: 600; color: #fff; }
.lp-footer__tagline { font-size: 0.875rem; color: rgba(255,255,255,0.35); line-height: 1.65; margin: 0; max-width: 260px; }
.lp-footer__links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.lp-footer__col { display: flex; flex-direction: column; gap: 0.75rem; }
.lp-footer__col-title { font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.08em; margin: 0; }
.lp-footer__col a { font-size: 0.875rem; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.25s; }
.lp-footer__col a:hover { color: rgba(255,255,255,0.7); }
.lp-footer__bottom { max-width: 1140px; margin: 0 auto; padding: 1.5rem 0; text-align: center; }
.lp-footer__bottom p { font-size: 0.8125rem; color: rgba(255,255,255,0.2); margin: 0; }

/* ========================
   QR SCANNER SECTION — refined dark
======================== */
.lp-qr {
  position: relative;
  background: #0a0a0a;
  padding: 8rem 2rem;
  overflow: hidden;
}
.lp-qr__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
/* Floating particles — subtler */
.lp-qr__particle {
  position: absolute;
  border-radius: 35%;
  background: radial-gradient(circle, rgba(74,222,128,0.35) 0%, transparent 70%);
  animation: qrParticleFloat linear infinite;
  will-change: transform, opacity;
}
@keyframes qrParticleFloat {
  0%   { transform: translateY(0) scale(1); opacity: 0.4; }
  50%  { opacity: 0.1; }
  100% { transform: translateY(-120px) scale(0.4); opacity: 0; }
}

.lp-qr__inner {
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* ---- Copy side ---- */
.lp-qr__copy {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.lp-badge--neon {
  background: rgba(74,222,128,0.08);
  color: #86efac;
  border: 1px solid rgba(74,222,128,0.15);
  border-radius: 35x;
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.3rem 0.875rem;
  letter-spacing: 0.04em;
  width: fit-content;
}
.lp-qr__title {
  font-size: clamp(2.25rem, 4.5vw, 3.5rem);
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -1.5px;
}
.lp-qr__title--glow {
  background: linear-gradient(90deg, #86efac, #4ade80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.lp-qr__desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.8;
  margin: 0;
  max-width: 460px;
}

/* Steps */
.lp-qr__steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.lp-qr__step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 35px;
  border: 1px solid rgba(255,255,255,0.04);
  background: transparent;
  transition: all 0.4s ease;
}
.lp-qr__step--active {
  border-color: rgba(74,222,128,0.15);
  background: rgba(74,222,128,0.04);
}
.lp-qr__step-num {
  width: 28px;
  height: 28px;
  border-radius: 35x;
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.5);
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.35s;
}
.lp-qr__step--active .lp-qr__step-num {
  background: rgba(74,222,128,0.15);
  color: #86efac;
}
.lp-qr__step-title { font-size: 0.875rem; font-weight: 600; color: rgba(255,255,255,0.8); margin: 0 0 0.1rem; }
.lp-qr__step-desc  { font-size: 0.8125rem; color: rgba(255,255,255,0.35); margin: 0; }

/* Chips */
.lp-qr__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.lp-qr__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 35x;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.5);
  font-size: 0.8125rem;
  font-weight: 400;
  transition: all 0.25s;
}
.lp-qr__chip:hover { border-color: rgba(74,222,128,0.2); color: rgba(255,255,255,0.7); }
.lp-qr__chip-icon { font-size: 0.9rem; }

/* Neon button — refined */
.lp-btn--neon {
  background: #1a6b42;
  color: #fff;
  box-shadow: none;
  animation: none;
}
.lp-btn--neon:hover {
  background: #22875a;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26,107,66,0.3);
}
@keyframes neonPulse {
  0%, 100% { box-shadow: none; }
  50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0), 0 2px 12px rgba(26,107,66,0.2); }
}

/* ---- Phone side ---- */
.lp-qr__phone-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: gentleFloat 6s ease-in-out infinite;
}
@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.lp-qr__glow {
  position: absolute;
  width: 320px;
  height: 440px;
  border-radius: 35%;
  background: radial-gradient(ellipse, rgba(74,222,128,0.1) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

/* Phone shell */
.lp-phone { position: relative; z-index: 1; }
.lp-phone__shell {
  width: 260px;
  background: #1a1a1a;
  border-radius: 35px;
  padding: 12px 10px 18px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.08),
    0 20px 60px rgba(0,0,0,0.5);
  position: relative;
}
.lp-phone__notch {
  width: 80px;
  height: 24px;
  background: #0a0a0a;
  border-radius: 350 16px 16px;
  margin: 0 auto 6px;
  position: relative;
}
.lp-phone__screen {
  background: #0d1a14;
  border-radius: 35px;
  height: 420px;
  overflow: hidden;
  position: relative;
}
.lp-phone__home-bar {
  width: 90px;
  height: 4px;
  background: rgba(255,255,255,0.12);
  border-radius: 35x;
  margin: 8px auto 0;
}

/* ---- Scanner view ---- */
.lp-phone__scanner {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 50% 100%, rgba(13, 74, 46, 0.35) 0%, #060e0a 60%);
  position: absolute;
  inset: 0;
}
.lp-scanner__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem 0.5rem;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
}
.lp-scanner__label { font-size: 0.75rem; letter-spacing: 0.04em; color: rgba(255,255,255,0.6); }
.lp-scanner__flash { cursor: pointer; }

.lp-scanner__viewport {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Dim overlay with cutout */
.lp-scanner__viewport::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E");
}

.lp-scanner__frame {
  width: 140px;
  height: 140px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.lp-scanner__qr-img {
  width: 100px;
  height: 100px;
  opacity: 0.6;
  animation: qrPulse 2.5s ease-in-out infinite;
}
@keyframes qrPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 0.75;  transform: scale(1.02); }
}
/* Corner brackets */
.lp-scanner__corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #4ade80;
  border-style: solid;
  border-radius: 35x;
}
.lp-scanner__corner--tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
.lp-scanner__corner--tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
.lp-scanner__corner--bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
.lp-scanner__corner--br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

/* Laser line */
.lp-scanner__laser {
  position: absolute;
  left: 5%;
  right: 5%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #4ade80, #86efac, #4ade80, transparent);
  border-radius: 35x;
  box-shadow: 0 0 8px 2px rgba(74,222,128,0.4);
  animation: laserScan 1.6s cubic-bezier(0.45,0,0.55,1) infinite;
  z-index: 2;
}
@keyframes laserScan {
  0%   { top: 8%;  opacity: 1; }
  90%  { top: 90%; opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

.lp-scanner__hint {
  color: rgba(255,255,255,0.35);
  font-size: 0.7rem;
  text-align: center;
  padding: 0 1rem 1.25rem;
  margin: 0;
  letter-spacing: 0.02em;
}

/* ---- Found view ---- */
.lp-phone__found {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #060e0a 0%, #0d1a14 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 1.5rem;
}
.lp-found__check {
  width: 50px;
  height: 50px;
  border-radius: 35%;
  background: #1a6b42;
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(26,107,66,0.4);
  animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes popIn {
  from { transform: scale(0.3); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
.lp-found__product { font-size: 0.875rem; font-weight: 600; color: #fff; margin: 0.25rem 0 0; text-align: center; }
.lp-found__sku { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin: 0; }
.lp-found__row { display: flex; gap: 1rem; align-items: baseline; }
.lp-found__price { font-size: 1.25rem; font-weight: 600; color: #86efac; }
.lp-found__stock { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
.lp-found__bar {
  width: 80%;
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 35x;
  overflow: hidden;
  margin-top: 0.5rem;
}
.lp-found__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a6b42, #4ade80);
  border-radius: 35x;
  animation: barFill 1.8s ease forwards;
}
@keyframes barFill {
  from { width: 0%; }
  to   { width: 100%; }
}
.lp-found__adding { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin: 0; }

/* ---- Success view ---- */
.lp-phone__success {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 40%, rgba(13,74,46,0.3) 0%, #060e0a 65%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  padding: 1.5rem;
}
.lp-success__ring {
  width: 68px;
  height: 68px;
  border-radius: 35%;
  background: #1a6b42;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  box-shadow:
    0 0 0 6px rgba(26,107,66,0.1),
    0 0 30px rgba(26,107,66,0.25);
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.lp-success__label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #86efac;
  margin: 0;
  letter-spacing: 0.02em;
}
.lp-success__receipt {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 35px;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.lp-receipt__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.45);
}
.lp-receipt__total {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 0.5rem;
  margin-top: 0.25rem;
}
.lp-success__time { font-size: 0.7rem; color: rgba(255,255,255,0.25); margin: 0; }

/* ---- Floating stat chips ---- */
.lp-qr__stat {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 35px;
  padding: 0.6rem 0.875rem;
  animation: gentleFloat 5s ease-in-out infinite;
  z-index: 3;
}
.lp-qr__stat--1 { top: 10%;  right: -1.5rem; animation-delay: 0s; }
.lp-qr__stat--2 { bottom: 28%; left: -1.5rem; animation-delay: 1.5s; }
.lp-qr__stat--3 { bottom: 8%;  right: 0;      animation-delay: 3s; }
.lp-qr__stat-icon { font-size: 1.125rem; }
.lp-qr__stat-num  { font-size: 1rem; font-weight: 600; color: #fff; margin: 0; line-height: 1; }
.lp-qr__stat-lbl  { font-size: 0.6875rem; color: rgba(255,255,255,0.35); margin: 0; }

/* View transitions */
.qr-fade-enter-active,
.qr-fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.qr-fade-enter-from   { opacity: 0; transform: translateY(6px) scale(0.98); }
.qr-fade-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.98); }
.qr-fade-enter-to,
.qr-fade-leave-from   { opacity: 1; transform: none; }

/* ========================
   RESPONSIVE
======================== */
@media (max-width: 900px) {
  .lp-nav__links, .lp-nav__cta { display: none; }
  .lp-nav__hamburger { display: flex; }
  .lp-hero__content { grid-template-columns: 1fr; gap: 3rem; padding: 5rem 1.5rem 3rem; }
  .lp-hero__visual { display: flex; justify-content: center; }
  .lp-hero__img { max-width: 340px; }
  .lp-float-card--1, .lp-float-card--3 { display: none; }
  .lp-float-card--2 { left: 0; }
  .lp-stats__inner { grid-template-columns: 1fr; gap: 3rem; }
  .lp-stats__img { display: none; }
  .lp-pricing__grid { grid-template-columns: 1fr; }
  .lp-price-card--featured { transform: none; }
  .lp-footer__inner { grid-template-columns: 1fr; gap: 2.5rem; }
  .lp-footer__links { grid-template-columns: 1fr 1fr; }
  .lp-how__steps { flex-direction: column; align-items: center; }
  .lp-step__connector { display: none; }
  .lp-feature-card { grid-template-columns: 1fr; padding: 2rem; gap: 2rem; }
  .lp-feature-card--reverse { direction: ltr; }
  .lp-testimonials__grid { grid-template-columns: 1fr; }
  /* QR Scanner responsive */
  .lp-qr__inner { grid-template-columns: 1fr; gap: 4rem; }
  .lp-qr__phone-wrap { order: -1; }
  .lp-qr__stat--1, .lp-qr__stat--3 { display: none; }
  .lp-qr__stat--2 { left: auto; right: -0.5rem; }
}
@media (max-width: 600px) {
  .lp-hero__title { font-size: 2rem; }
  .lp-hero__actions { flex-direction: column; align-items: flex-start; }
  .lp-stats__cards { grid-template-columns: 1fr 1fr; }
  .lp-footer__links { grid-template-columns: 1fr; }
}

/* ========================
   DEVELOPER SECTION & CONTACT — minimal
======================== */
.lp-developer {
  padding: 8rem 2rem;
  background: #fff;
}
.lp-developer__inner {
  max-width: 1060px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 4rem;
  align-items: flex-start;
}
.lp-developer__profile {
  background: #fafafa;
  padding: 2.5rem;
  border-radius: 35px;
  border: 1px solid #ebebeb;
  text-align: center;
}
.lp-developer__avatar {
  width: 100px;
  height: 100px;
  border-radius: 35%;
  object-fit: cover;
  margin: 0 auto 1.5rem;
  border: 3px solid #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.lp-developer__name {
  font-size: 1.575rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 0.25rem;
}
.lp-developer__role {
  font-size: 0.875rem;
  color: #1a6b42;
  font-weight: 500;
  margin: 0 0 1.5rem;
}
.lp-developer__quote {
  font-size: 0.9375rem;
  color: #71717a;
  font-style: italic;
  line-height: 1.7;
  margin: 0 0 2rem;
}
.lp-developer__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.lp-btn--whatsapp {
  background: #25D366;
  color: #fff;
  justify-content: center;
  border-radius: 35px;
}
.lp-btn--whatsapp::before {
  background: linear-gradient(135deg, #20bd5a, #1aab4d);
}
.lp-btn--whatsapp:hover {
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 211, 102, 0.3);
}

.lp-developer__forms {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.lp-contact-form, .lp-comments {
  background: #fafafa;
  padding: 2rem;
  border-radius: 35px;
  border: 1px solid #ebebeb;
}
.lp-form-title {
  font-size: 1.325rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 1.5rem;
}
.lp-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 35px;
  font-size: 0.9375rem;
  font-family: inherit;
  margin-bottom: 0.875rem;
  background: #fff;
  transition: all 0.25s;
  box-sizing: border-box;
  color: #111;
}
.lp-input::placeholder { color: #a1a1aa; }
.lp-input:focus {
  outline: none;
  border-color: #1a6b42;
  box-shadow: 0 0 0 3px rgba(26,107,66,0.06);
}
.lp-textarea {
  min-height: 110px;
  resize: vertical;
}
.lp-textarea--sm {
  min-height: 70px;
  margin-bottom: 0.625rem;
}
.lp-input--sm {
  padding: 0.6rem 0.875rem;
  font-size: 0.875rem;
  margin-bottom: 0.625rem;
}
.lp-form-success {
  margin-top: 1rem;
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  padding: 0.75rem;
  border-radius: 35px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.lp-comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 0.5rem;
}
.lp-comments-list::-webkit-scrollbar { width: 4px; }
.lp-comments-list::-webkit-scrollbar-track { background: transparent; }
.lp-comments-list::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 35x; }
.lp-comment-item {
  background: #fff;
  padding: 1rem;
  border-radius: 35px;
  border: 1px solid #f0f0f0;
}
.lp-comment-author {
  font-weight: 600;
  color: #111;
  font-size: 0.8125rem;
  display: block;
  margin-bottom: 0.25rem;
}
.lp-comment-text {
  margin: 0;
  font-size: 0.875rem;
  color: #71717a;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .lp-developer__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

/* ========================
   SCROLL REVEAL ANIMATIONS
======================== */
.lp-reveal {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.lp-reveal.lp-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Hero variant — starts immediately, slightly different motion */
.lp-reveal--hero {
  opacity: 0;
  transform: translateY(24px);
  animation: heroReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes heroReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .lp-reveal,
  .lp-reveal--hero {
    opacity: 1;
    transform: none;
    transition: none;
    animation: none;
  }
  .lp-mesh__orb { animation: none !important; }
}
</style>


