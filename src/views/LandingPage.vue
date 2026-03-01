<template>
  <div class="lp-root">
    <!-- ===== NAVBAR ===== -->
    <nav class="lp-nav" :class="{ 'lp-nav--scrolled': scrolled }">
      <div class="lp-nav__inner">
        <div class="lp-nav__brand">
          <img src="/nurax_logo.png" alt="Nurax Logo" class="lp-nav__logo" />
          <span class="lp-nav__brand-name">Nurax</span>
        </div>
        <div class="lp-nav__links">
          <a href="#features" class="lp-nav__link">Funciones</a>
          <a href="#qr-scanner" class="lp-nav__link">Scanner QR</a>
          <a href="#stats" class="lp-nav__link">Resultados</a>
          <a href="#testimonials" class="lp-nav__link">Testimonios</a>
          <a href="#pricing" class="lp-nav__link">Precios</a>
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
        <a href="#testimonials" @click="mobileMenuOpen=false">Testimonios</a>
        <a href="#pricing" @click="mobileMenuOpen=false">Precios</a>
        <a href="/auth/login" class="lp-btn lp-btn--fill">Iniciar Sesión</a>
      </div>
    </nav>

    <!-- ===== HERO ===== -->
    <section class="lp-hero">
      <div class="lp-hero__blobs">
        <div class="lp-blob lp-blob--1"></div>
        <div class="lp-blob lp-blob--2"></div>
        <div class="lp-blob lp-blob--3"></div>
      </div>
      <div class="lp-hero__content">
        <div class="lp-hero__text">
          <h1 class="lp-hero__title">
            Deja de perder dinero.<br />
            <span class="lp-gradient-text">Controla todo</span> desde un solo lugar.
          </h1>
          <p class="lp-hero__desc">
            Nurax es el sistema de inventario inteligente que pequeños y medianos negocios necesitan para crecer sin complicaciones. Ventas, stock, proveedores y reportes — todo en tiempo real.
          </p>
          <div class="lp-hero__actions">
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
            <img src="/hero_dashboard.png" alt="Dashboard Nurax" class="lp-hero__img" />
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
      <div class="lp-section-header">
        <h2 class="lp-section-title">Todo lo que tu negocio necesita,<br /><span class="lp-gradient-text">sin complicaciones</span></h2>
        <p class="lp-section-desc">Diseñado para que cualquier persona pueda usarlo desde el primer día, sin necesitar ser experto en tecnología.</p>
      </div>
      <div class="lp-features__grid">

        <!-- Feature 1: Inventario -->
        <div class="lp-feature-card lp-feature-card--wide">
          <div class="lp-feature-card__body">
            <span class="lp-feature-icon">📦</span>
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
            <img src="/feature_inventory.png" alt="Inventario" />
          </div>
        </div>

        <!-- Feature 2: Ventas -->
        <div class="lp-feature-card lp-feature-card--wide lp-feature-card--reverse">
          <div class="lp-feature-card__body">
            <span class="lp-feature-icon">💳</span>
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
            <img src="/feature_sales.png" alt="Ventas" />
          </div>
        </div>

        <!-- Feature 3: Proveedores -->
        <div class="lp-feature-card lp-feature-card--wide">
          <div class="lp-feature-card__body">
            <span class="lp-feature-icon">🚚</span>
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
            <img src="/feature_suppliers.png" alt="Proveedores" />
          </div>
        </div>

      </div>

      <!-- Mini features grid -->
      <div class="lp-mini-features">
        <div class="lp-mini-card" v-for="mf in miniFeatures" :key="mf.title">
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
          <span class="lp-badge lp-badge--neon">📱 Nuevo · Scanner QR</span>
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
        <div class="lp-stats__text">
          <span class="lp-badge lp-badge--light">📈 Resultados reales</span>
          <h2 class="lp-stats__title">Números que hablan<br /><span class="lp-gradient-text">por sí solos</span></h2>
          <p class="lp-stats__desc">Los negocios que usan Nurax reportan mejoras significativas en su operación desde el primer mes de uso.</p>
          <a href="/auth/login" class="lp-btn lp-btn--fill lp-btn--lg" style="margin-top:2rem;">
            Quiero estos resultados
          </a>
        </div>
        <div class="lp-stats__cards">
          <div class="lp-stat-card" v-for="s in stats" :key="s.label">
            <span class="lp-stat-icon">{{ s.icon }}</span>
            <p class="lp-stat-num">{{ s.num }}</p>
            <p class="lp-stat-label">{{ s.label }}</p>
          </div>
        </div>
        <div class="lp-stats__img">
          <img src="/stats_growth.png" alt="Crecimiento" />
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="lp-how">
      <div class="lp-section-header">
        <h2 class="lp-section-title">Empieza a vender<br /><span class="lp-gradient-text">en 3 pasos</span></h2>
      </div>
      <div class="lp-how__steps">
        <div class="lp-step" v-for="(step, i) in steps" :key="i">
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

    <!-- ===== CTA FINAL ===== -->
    <section class="lp-cta">
      <div class="lp-cta__inner">
        <div class="lp-blob lp-blob--cta1"></div>
        <div class="lp-blob lp-blob--cta2"></div>
        <h2 class="lp-cta__title">¿Listo para transformar<br />tu negocio hoy?</h2>
        <p class="lp-cta__desc">Únete a más de 500 negocios que ya dejaron de perder tiempo y dinero con hojas de cálculo desactualizadas.</p>
        <a href="/auth/login" class="lp-btn lp-btn--white lp-btn--lg">
          🎉 Empieza gratis — sin tarjeta de crédito
        </a>
        <p class="lp-cta__footnote">14 días gratis · Sin compromiso · Cancela cuando quieras</p>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="lp-footer">
      <div class="lp-footer__inner">
        <div class="lp-footer__brand">
          <img src="/nurax_logo_dark.png" alt="Nurax" class="lp-footer__logo" />
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
        <p>© 2025 Nurax Systems. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => { scrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

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
  { icon: '🌐', label: 'Funciona offline' },
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
   ROOT & GLOBAL
======================== */
.lp-root {
  font-family: 'Inter', sans-serif;
  background: #ffffff;
  color: #1f2937;
  overflow-x: hidden;
}

/* ========================
   UTILS
======================== */
.lp-gradient-text {
  background: linear-gradient(135deg, #227d52, #06402B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lp-badge {
  display: inline-block;
  background: #e8f5ef;
  color: #06402B;
  border: 1px solid #c6e8d5;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.3rem 0.875rem;
  letter-spacing: 0.02em;
}
.lp-badge--dark {
  background: #06402B;
  color: #ffffff;
  border-color: transparent;
}
.lp-badge--light {
  background: rgba(255,255,255,0.2);
  color: #ffffff;
  border-color: rgba(255,255,255,0.3);
}

/* Buttons */
.lp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 0.75rem 1.75rem;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.22s ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}
.lp-btn--fill {
  background: linear-gradient(135deg, #227d52, #06402B);
  color: #fff;
  box-shadow: 0 4px 20px rgba(6,64,43,0.3);
}
.lp-btn--fill:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(6,64,43,0.4); }
.lp-btn--outline {
  background: transparent;
  color: #06402B;
  border: 2px solid #06402B;
}
.lp-btn--outline:hover { background: #06402B; color: #fff; transform: translateY(-2px); }
.lp-btn--white {
  background: #fff;
  color: #06402B;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.lp-btn--white:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
.lp-btn--lg { font-size: 1rem; padding: 0.9rem 2rem; }
.lp-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

/* Blobs */
.lp-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}

/* Section header */
.lp-section-header {
  text-align: center;
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.lp-section-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #111827;
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.5px;
}
.lp-section-desc {
  font-size: 1.0625rem;
  color: #6b7280;
  max-width: 560px;
  line-height: 1.65;
  margin: 0;
}

/* ========================
   NAVBAR
======================== */
.lp-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}
.lp-nav--scrolled {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  box-shadow: 0 1px 20px rgba(0,0,0,0.08);
  padding: 0.625rem 0;
}
.lp-nav__inner {
  max-width: 1200px;
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
.lp-nav__logo { width: 36px; height: 36px; object-fit: contain; }
.lp-nav__brand-name { font-size: 1.25rem; font-weight: 800; color: #06402B; }
.lp-nav__links { display: flex; align-items: center; gap: 0.25rem; margin-left: auto; }
.lp-nav__link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  transition: all 0.2s;
}
.lp-nav__link:hover { color: #06402B; background: #e8f5ef; }
.lp-nav__cta { margin-left: 1rem; font-size: 0.875rem; padding: 0.6rem 1.25rem; }
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
.lp-nav__hamburger span { width: 24px; height: 2px; background: #374151; border-radius: 2px; display: block; }
.lp-nav__mobile {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}
.lp-nav__mobile.lp-nav__mobile--open { display: flex; }
.lp-nav__mobile a { color: #374151; text-decoration: none; font-weight: 500; font-size: 0.9375rem; }

/* ========================
   HERO
======================== */
.lp-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(160deg, #f0faf5 0%, #e8f5ef 30%, #ffffff 70%);
  overflow: hidden;
  padding-top: 80px;
}
.lp-hero__blobs { position: absolute; inset: 0; pointer-events: none; }
.lp-blob--1 { width: 500px; height: 500px; background: rgba(34,197,94,0.12); top: -150px; right: -100px; animation: blobPulse 8s ease-in-out infinite alternate; }
.lp-blob--2 { width: 350px; height: 350px; background: rgba(6,64,43,0.08); bottom: -100px; left: -80px; animation: blobPulse 10s ease-in-out infinite alternate-reverse; }
.lp-blob--3 { width: 200px; height: 200px; background: rgba(34,197,94,0.2); top: 40%; left: 45%; animation: blobPulse 6s ease-in-out infinite; }
@keyframes blobPulse { from { transform: scale(1) translate(0,0); } to { transform: scale(1.2) translate(20px,-20px); } }

.lp-hero__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}
.lp-hero__text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.lp-hero__title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #111827;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -1px;
}
.lp-hero__desc {
  font-size: 1.125rem;
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
  max-width: 520px;
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
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}
.lp-trust-avatars img:first-child { margin-left: 0; }
.lp-trust-text { font-size: 0.875rem; color: #6b7280; font-weight: 500; }

/* Hero visual */
.lp-hero__visual { position: relative; }
.lp-hero__img-wrapper {
  position: relative;
  animation: floatY 5s ease-in-out infinite;
}
@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
.lp-hero__img { 
  width: 100%; 
  max-width: 540px; 
  object-fit: contain; 
  filter: drop-shadow(0 30px 60px rgba(6,64,43,0.18)); 
  display: block; 
  mix-blend-mode: multiply;  
  -webkit-mask-image: radial-gradient(
    ellipse at center,
    rgba(0,0,0,1) 50%,
    rgba(0,0,0,0) 80%
  );
  mask-image: radial-gradient(
    ellipse at center,
    rgba(0,0,0,1) 50%,
    rgba(0,0,0,0) 80%
  ); }

/* Float cards */
.lp-float-card {
  position: absolute;
  background: #fff;
  border-radius: 16px;
  padding: 0.75rem 1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: floatCard 4s ease-in-out infinite;
}
.lp-float-card--1 { top: 10%; right: -1rem; animation-delay: 0s; }
.lp-float-card--2 { bottom: 20%; left: -2rem; animation-delay: 1s; }
.lp-float-card--3 { bottom: 5%; right: 5%; animation-delay: 2s; }
@keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.lp-float-icon { font-size: 1.75rem; }
.lp-float-num { font-size: 1.125rem; font-weight: 800; color: #111827; margin: 0; line-height: 1; }
.lp-float-label { font-size: 0.75rem; color: #6b7280; margin: 0.125rem 0 0; }

/* ========================
   LOGOS BAND
======================== */
.lp-logos {
  padding: 2rem 0;
  background: linear-gradient(90deg, #06402B, #227d52, #06402B);
  overflow: hidden;
}
.lp-logos__label { text-align: center; color: rgba(255,255,255,0.7); font-size: 0.8125rem; font-weight: 500; margin-bottom: 1.25rem; letter-spacing: 0.05em; text-transform: uppercase; }
.lp-logos__track { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; padding: 0 2rem; }
.lp-logo-chip { background: rgba(255,255,255,0.12); color: #fff; padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; }

/* ========================
   FEATURES
======================== */
.lp-features {
  padding: 7rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.lp-features__grid { display: flex; flex-direction: column; gap: 5rem; margin-bottom: 5rem; }

.lp-feature-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  background: linear-gradient(135deg, #f9fafb, #f0faf5);
  border-radius: 28px;
  padding: 3.5rem;
  border: 1px solid #e8f5ef;
  box-shadow: 0 4px 24px rgba(6,64,43,0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}
.lp-feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(6,64,43,0.12); }
.lp-feature-card--reverse { direction: rtl; }
.lp-feature-card--reverse > * { direction: ltr; }

.lp-feature-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.lp-feature-title { font-size: 1.875rem; font-weight: 800; color: #111827; margin: 0 0 1rem; letter-spacing: -0.3px; }
.lp-feature-desc { font-size: 1.0625rem; color: #4b5563; line-height: 1.7; margin: 0 0 1.5rem; }
.lp-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.lp-feature-list li { font-size: 0.9375rem; color: #227d52; font-weight: 500; }

.lp-feature-card__img { display: flex; justify-content: center; align-items: center; }
.lp-feature-card__img img { width: 100%; max-width: 360px; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(6,64,43,0.12)); mix-blend-mode: multiply; border-radius: 16px; }

/* Mini features */
.lp-mini-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.lp-mini-card {
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  transition: all 0.25s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.lp-mini-card:hover { border-color: #a7d7bc; box-shadow: 0 8px 24px rgba(6,64,43,0.1); transform: translateY(-2px); }
.lp-mini-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
.lp-mini-title { font-size: 1.0625rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
.lp-mini-desc { font-size: 0.9rem; color: #6b7280; margin: 0; line-height: 1.6; }

/* ========================
   STATS
======================== */
.lp-stats {
  background: linear-gradient(135deg, #06402B, #0e5c38, #227d52);
  padding: 7rem 2rem;
  position: relative;
  overflow: hidden;
}
.lp-blob--cta1 { width: 400px; height: 400px; background: rgba(255,255,255,0.05); top: -100px; left: -100px; }
.lp-blob--cta2 { width: 300px; height: 300px; background: rgba(255,255,255,0.05); bottom: -80px; right: -80px; }
.lp-stats__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}
.lp-stats__text { display: flex; flex-direction: column; gap: 1rem; }
.lp-stats__title { font-size: clamp(1.75rem, 3.5vw, 2.5rem); font-weight: 900; color: #fff; margin: 0; line-height: 1.15; letter-spacing: -0.5px; }
.lp-stats__title .lp-gradient-text { background: linear-gradient(135deg,#b8f4d8,#5dd9a4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.lp-stats__desc { font-size: 1.0625rem; color: rgba(255,255,255,0.75); line-height: 1.65; margin: 0; }

.lp-stats__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.lp-stat-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
}
.lp-stat-icon { font-size: 1.75rem; display: block; margin-bottom: 0.5rem; }
.lp-stat-num { font-size: 2rem; font-weight: 900; color: #fff; margin: 0; line-height: 1; }
.lp-stat-label { font-size: 0.8125rem; color: rgba(255,255,255,0.7); margin: 0.375rem 0 0; font-weight: 500; }

.lp-stats__img { display: flex; justify-content: center; }
.lp-stats__img img { width: 280px; max-width: 100%; object-fit: contain; animation: floatY 5s ease-in-out infinite; mix-blend-mode: luminosity; filter: brightness(1.15); }

/* ========================
   HOW IT WORKS
======================== */
.lp-how { padding: 7rem 2rem; background: #f9fafb; }
.lp-how__steps {
  max-width: 960px;
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
  width: 52px; height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg,#227d52,#06402B);
  color: #fff;
  font-size: 1.375rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(6,64,43,0.3);
  flex-shrink: 0;
}
.lp-step__icon { font-size: 3rem; }
.lp-step__title { font-size: 1.25rem; font-weight: 800; color: #111827; margin: 0; }
.lp-step__desc { font-size: 0.9375rem; color: #6b7280; margin: 0; line-height: 1.6; }
.lp-step__connector {
  position: absolute;
  top: 4.5rem;
  right: -1rem;
  font-size: 1.5rem;
  color: #227d52;
  z-index: 2;
  font-weight: 900;
}

/* ========================
   TESTIMONIALS
======================== */
.lp-testimonials { padding: 7rem 2rem; background: #fff; }
.lp-testimonials__grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
}
.lp-testimonial-card {
  padding: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.lp-testimonial-card:hover { border-color: #a7d7bc; box-shadow: 0 8px 32px rgba(6,64,43,0.1); transform: translateY(-3px); }
.lp-testimonial-stars { font-size: 1rem; }
.lp-testimonial-text { font-size: 0.9375rem; color: #374151; line-height: 1.7; margin: 0; flex: 1; font-style: italic; }
.lp-testimonial-author { display: flex; align-items: center; gap: 0.875rem; }
.lp-testimonial-author img { width: 44px; height: 44px; border-radius: 50%; }
.lp-testimonial-name { font-weight: 700; font-size: 0.9375rem; color: #111827; margin: 0; }
.lp-testimonial-role { font-size: 0.8125rem; color: #6b7280; margin: 0.1rem 0 0; }

/* ========================
   PRICING
======================== */
.lp-pricing { padding: 7rem 2rem; background: linear-gradient(160deg, #f0faf5, #ffffff); }
.lp-pricing__grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
.lp-price-card {
  padding: 2.5rem 2rem;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  transition: all 0.25s;
}
.lp-price-card:hover { border-color: #a7d7bc; box-shadow: 0 8px 32px rgba(6,64,43,0.1); }
.lp-price-card--featured {
  border-color: #06402B;
  background: linear-gradient(160deg, #06402B, #0e5c38);
  color: #fff;
  box-shadow: 0 16px 48px rgba(6,64,43,0.3);
  transform: scale(1.04);
}
.lp-price-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1f2937;
  padding: 0.3rem 1rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  white-space: nowrap;
}
.lp-price-name { font-size: 1.25rem; font-weight: 800; margin: 0; }
.lp-price-card--featured .lp-price-name { color: #fff; }
.lp-price-amount { display: flex; align-items: baseline; gap: 0.25rem; }
.lp-price-currency { font-size: 1.5rem; font-weight: 700; color: #374151; }
.lp-price-num { font-size: 3rem; font-weight: 900; color: #111827; line-height: 1; }
.lp-price-period { font-size: 0.9rem; color: #6b7280; }
.lp-price-card--featured .lp-price-currency,
.lp-price-card--featured .lp-price-num { color: #fff; }
.lp-price-card--featured .lp-price-period { color: rgba(255,255,255,0.6); }
.lp-price-desc { font-size: 0.9rem; color: #6b7280; margin: 0; }
.lp-price-card--featured .lp-price-desc { color: rgba(255,255,255,0.75); }
.lp-price-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.625rem; flex: 1; }
.lp-price-features li { font-size: 0.9rem; color: #374151; font-weight: 500; }
.lp-price-card--featured .lp-price-features li { color: rgba(255,255,255,0.9); }

/* ========================
   CTA FINAL
======================== */
.lp-cta {
  background: linear-gradient(135deg, #06402B, #227d52);
  padding: 7rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.lp-cta__inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.lp-cta__title { font-size: clamp(2rem, 4.5vw, 3rem); font-weight: 900; color: #fff; margin: 0; line-height: 1.15; letter-spacing: -0.5px; }
.lp-cta__desc { font-size: 1.0625rem; color: rgba(255,255,255,0.8); line-height: 1.65; margin: 0; }
.lp-cta__footnote { font-size: 0.875rem; color: rgba(255,255,255,0.6); margin: 0; }

/* ========================
   FOOTER
======================== */
.lp-footer { background: #0a0f0d; padding: 4rem 2rem 0; }
.lp-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.lp-footer__brand { display: flex; flex-direction: column; gap: 0.75rem; }
.lp-footer__logo { width: 40px; height: 40px; object-fit: contain; }
.lp-footer__name { font-size: 1.375rem; font-weight: 800; color: #fff; }
.lp-footer__tagline { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.6; margin: 0; max-width: 260px; }
.lp-footer__links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.lp-footer__col { display: flex; flex-direction: column; gap: 0.75rem; }
.lp-footer__col-title { font-size: 0.875rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.lp-footer__col a { font-size: 0.9rem; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
.lp-footer__col a:hover { color: #5dd9a4; }
.lp-footer__bottom { max-width: 1200px; margin: 0 auto; padding: 1.5rem 0; text-align: center; }
.lp-footer__bottom p { font-size: 0.875rem; color: rgba(255,255,255,0.35); margin: 0; }

/* ========================
   QR SCANNER SECTION
======================== */
.lp-qr {
  position: relative;
  background: #060c09;
  padding: 7rem 2rem;
  overflow: hidden;
}
.lp-qr__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
/* Floating particles */
.lp-qr__particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34,197,94,0.6) 0%, transparent 70%);
  animation: qrParticleFloat linear infinite;
  will-change: transform, opacity;
}
@keyframes qrParticleFloat {
  0%   { transform: translateY(0) scale(1); opacity: 0.6; }
  50%  { opacity: 0.15; }
  100% { transform: translateY(-120px) scale(0.4); opacity: 0; }
}

.lp-qr__inner {
  max-width: 1200px;
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
  background: rgba(34,197,94,0.12);
  color: #5dd9a4;
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 999px;
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.3rem 0.875rem;
  letter-spacing: 0.04em;
  width: fit-content;
}
.lp-qr__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin: 0;
  line-height: 1.05;
  letter-spacing: -1.5px;
}
.lp-qr__title--glow {
  background: linear-gradient(90deg, #5dd9a4, #34d399, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px rgba(34,197,94,0.55));
}
.lp-qr__desc {
  font-size: 1.0625rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.75;
  margin: 0;
  max-width: 480px;
}

/* Steps */
.lp-qr__steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.lp-qr__step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.875rem 1.125rem;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
  transition: all 0.35s ease;
}
.lp-qr__step--active {
  border-color: rgba(34,197,94,0.35);
  background: rgba(34,197,94,0.07);
  box-shadow: 0 0 24px rgba(34,197,94,0.08) inset;
}
.lp-qr__step-num {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #227d52, #06402B);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.35s;
}
.lp-qr__step--active .lp-qr__step-num {
  background: linear-gradient(135deg, #34d399, #22c55e);
  box-shadow: 0 0 16px rgba(34,197,94,0.5);
}
.lp-qr__step-title { font-size: 0.9375rem; font-weight: 700; color: #fff; margin: 0 0 0.15rem; }
.lp-qr__step-desc  { font-size: 0.8125rem; color: rgba(255,255,255,0.5); margin: 0; }

/* Chips */
.lp-qr__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}
.lp-qr__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.75);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.2s;
}
.lp-qr__chip:hover { border-color: rgba(34,197,94,0.4); color: #5dd9a4; }
.lp-qr__chip-icon { font-size: 1rem; }

/* Neon button */
.lp-btn--neon {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  box-shadow: 0 0 0 0 rgba(34,197,94,0.5);
  animation: neonPulse 2.5s ease-in-out infinite;
}
.lp-btn--neon:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 32px rgba(34,197,94,0.5), 0 0 48px rgba(34,197,94,0.2);
  animation: none;
}
@keyframes neonPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5), 0 4px 20px rgba(34,197,94,0.3); }
  50%       { box-shadow: 0 0 0 12px rgba(34,197,94,0), 0 4px 20px rgba(34,197,94,0.3); }
}

/* ---- Phone side ---- */
.lp-qr__phone-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
   animation: floatY 5s ease-in-out infinite;
}
.lp-qr__glow {
  position: absolute;
  width: 340px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(34,197,94,0.22) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}

/* Phone shell */
.lp-phone { position: relative; z-index: 1; }
.lp-phone__shell {
  width: 270px;
  background: #111;
  border-radius: 44px;
  padding: 14px 10px 20px;
  box-shadow:
    0 0 0 1.5px rgba(255,255,255,0.12),
    0 0 0 3px rgba(255,255,255,0.04),
    0 30px 80px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.08);
  position: relative;
}
.lp-phone__notch {
  width: 90px;
  height: 26px;
  background: #000;
  border-radius: 0 0 18px 18px;
  margin: 0 auto 8px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.6);
}
.lp-phone__screen {
  background: #0d1f17;
  border-radius: 32px;
  height: 430px;
  overflow: hidden;
  position: relative;
}
.lp-phone__home-bar {
  width: 100px;
  height: 4px;
  background: rgba(255,255,255,0.18);
  border-radius: 4px;
  margin: 10px auto 0;
}

/* ---- Scanner view ---- */
.lp-phone__scanner {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 50% 100%, rgba(6, 64, 43, 0.45) 0%, #050e0a 60%);
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
  font-weight: 700;
}
.lp-scanner__label { font-size: 0.8125rem; letter-spacing: 0.04em; }
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
  background: rgba(0,0,0,0.55);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E");
}

.lp-scanner__frame {
  width: 150px;
  height: 150px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.lp-scanner__qr-img {
  width: 110px;
  height: 110px;
  opacity: 0.75;
  animation: qrPulse 2s ease-in-out infinite;
}
@keyframes qrPulse {
  0%, 100% { opacity: 0.65; transform: scale(1); }
  50%       { opacity: 0.9;  transform: scale(1.03); }
}
/* Corner brackets */
.lp-scanner__corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border-color: #22c55e;
  border-style: solid;
  border-radius: 2px;
}
.lp-scanner__corner--tl { top: 0; left: 0; border-width: 3px 0 0 3px; }
.lp-scanner__corner--tr { top: 0; right: 0; border-width: 3px 3px 0 0; }
.lp-scanner__corner--bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; }
.lp-scanner__corner--br { bottom: 0; right: 0; border-width: 0 3px 3px 0; }

/* Laser line */
.lp-scanner__laser {
  position: absolute;
  left: 5%;
  right: 5%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #22c55e, #86efac, #22c55e, transparent);
  border-radius: 2px;
  box-shadow: 0 0 10px 3px rgba(34,197,94,0.7);
  animation: laserScan 1.4s cubic-bezier(0.45,0,0.55,1) infinite;
  z-index: 2;
}
@keyframes laserScan {
  0%   { top: 8%;  opacity: 1; }
  90%  { top: 90%; opacity: 1; }
  100% { top: 90%; opacity: 0; }
}

.lp-scanner__hint {
  color: rgba(255,255,255,0.5);
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
  background: linear-gradient(180deg, #050e0a 0%, #071a10 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 1.5rem;
}
.lp-found__check {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(34,197,94,0.55);
  animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes popIn {
  from { transform: scale(0.3); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
.lp-found__product { font-size: 0.875rem; font-weight: 800; color: #fff; margin: 0.25rem 0 0; text-align: center; }
.lp-found__sku { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin: 0; }
.lp-found__row { display: flex; gap: 1rem; align-items: baseline; }
.lp-found__price { font-size: 1.375rem; font-weight: 900; color: #5dd9a4; }
.lp-found__stock { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
.lp-found__bar {
  width: 80%;
  height: 5px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}
.lp-found__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #86efac);
  border-radius: 4px;
  animation: barFill 1.8s ease forwards;
}
@keyframes barFill {
  from { width: 0%; }
  to   { width: 100%; }
}
.lp-found__adding { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin: 0; }

/* ---- Success view ---- */
.lp-phone__success {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 40%, rgba(22,101,52,0.45) 0%, #050e0a 65%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  padding: 1.5rem;
}
.lp-success__ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #166534 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow:
    0 0 0 8px rgba(34,197,94,0.12),
    0 0 40px rgba(34,197,94,0.45);
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.lp-success__label {
  font-size: 1rem;
  font-weight: 900;
  color: #5dd9a4;
  margin: 0;
  letter-spacing: 0.02em;
}
.lp-success__receipt {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.lp-receipt__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
}
.lp-receipt__total {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  font-weight: 800;
  color: #fff;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 0.5rem;
  margin-top: 0.25rem;
}
.lp-success__time { font-size: 0.7rem; color: rgba(255,255,255,0.35); margin: 0; }

/* ---- Floating stat chips ---- */
.lp-qr__stat {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 0.6rem 0.875rem;
  animation: floatCard 4s ease-in-out infinite;
  z-index: 3;
}
.lp-qr__stat--1 { top: 10%;  right: -1.5rem; animation-delay: 0s; }
.lp-qr__stat--2 { bottom: 28%; left: -1.5rem; animation-delay: 1.2s; }
.lp-qr__stat--3 { bottom: 8%;  right: 0;      animation-delay: 0.6s; }
.lp-qr__stat-icon { font-size: 1.25rem; }
.lp-qr__stat-num  { font-size: 1.0625rem; font-weight: 900; color: #fff; margin: 0; line-height: 1; }
.lp-qr__stat-lbl  { font-size: 0.6875rem; color: rgba(255,255,255,0.5); margin: 0; }

/* View transitions */
.qr-fade-enter-active,
.qr-fade-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.qr-fade-enter-from   { opacity: 0; transform: translateY(8px) scale(0.97); }
.qr-fade-leave-to     { opacity: 0; transform: translateY(-8px) scale(0.97); }
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
</style>
