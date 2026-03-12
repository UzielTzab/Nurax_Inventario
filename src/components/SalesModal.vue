<template>
  <!-- Desktop: Modal clásico -->
  <div v-if="isOpen && !isMobileOrTablet" class="modal-overlay">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">Punto de Venta</h2>
        <button class="modal-close-btn" @click="$emit('close')" title="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isInitializing" class="empty-state">
         <div class="flex justify-center items-center">
            <svg class="animate-spin h-12 w-12" style="color: var(--color-brand-main)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
         </div>
         <h2 class="text-xl font-bold mt-4" style="color: #374151;">Cargando Terminal...</h2>
         <p class="text-gray-500 max-w-sm mt-2">Sincronizando caja, inventario y ventas recientes.</p>
      </div>

      <div v-else-if="shiftsStore.hasOpenShift" class="sale-layout">
        
        <!-- Left Panel: Search + Grid -->
        <div class="left-panel">
          <!-- Premium Search Section -->
          <div class="search-section">
            <div class="search-input-wrapper">
              <MagnifyingGlassIcon class="search-icon" />
              <input 
                v-model="searchQuery"
                @keyup.enter="handleScanSubmit"
                type="text" 
                placeholder="Escanea o busca por producto/SKU..." 
                class="search-input"
              />
            </div>
            <button class="icon-btn scan-btn-premium" title="Escanear con Cámara" @click="isScanning = true">
              <QrCodeIcon class="w-5 h-5" />
            </button>
            <button class="icon-btn" title="Filtros">
              <FunnelIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Products List -->
          <div class="products-list">
             <div v-if="filteredProducts.length === 0" class="empty-state">
               <svg v-if="!searchQuery" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
               </svg>
               <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
               </svg>
               <p v-if="!searchQuery">Empieza a escribir para buscar productos</p>
               <p v-else>No se encontraron productos con "{{ searchQuery }}"</p>
             </div>

             <div v-else class="products-grid">
                <div 
                 v-for="product in filteredProducts" 
                 :key="product.id" 
                 class="product-card"
                 @click="addToCart(product)"
               >
                 <div class="product-image">
                   <img v-if="product.image_url" :src="product.image_url" :alt="product.name">
                   <div v-else class="empty-image">
                     <PhotoIcon class="empty-icon-lg" />
                   </div>
                   <span 
                     class="stock-badge"
                     :class="{ 'badge-low': getAvailableStock(product) <= 10, 'badge-out': getAvailableStock(product) === 0 }"
                   >
                     {{ getAvailableStock(product) }} EN STOCK
                   </span>
                 </div>

                 <div class="product-info">
                   <div class="product-header">
                     <h4 class="product-name">{{ product.name }}</h4>
                     <span class="product-sku">SKU-{{ product.sku }}</span>
                   </div>
                   <div class="product-footer">
                     <span class="product-price">${{ Number(product.price).toFixed(2) }}</span>
                     <button class="add-btn" @click.stop="addToCart(product)">
                       <PlusIcon class="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <!-- Pagination -->
          <Pagination
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.count"
            @update:current-page="goToPage"
            @update:page-size="setPageSize"
          />
        </div>

        <!-- Right Panel: Current Sale / Cart -->
        <div class="right-panel">
          
          <div class="cart-header">
            <div class="cart-title">
              <ShoppingCartIcon class="cart-icon" />
              <h3>Resumen de Venta</h3>
            </div>
            <button class="clear-cart-btn" @click="clearCart" :disabled="cart.length === 0" title="Vaciar venta">
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
          
          <div v-if="cart.length === 0" class="sale-items-placeholder">
            <p class="text-muted">Agrega productos a la venta</p>
          </div>

          <div v-else class="cart-items-container">
            <div v-for="item in cart" :key="item.id" class="cart-item">
               <div class="cart-item-image">
                 <img v-if="item.image_url" :src="item.image_url" :alt="item.name">
                 <div v-else class="empty-image">
                   <PhotoIcon class="empty-icon-sm" />
                 </div>
              </div>
              
              <div class="cart-item-info">
                 <span class="cart-item-name">{{ item.name }}</span>
                 <span class="cart-item-unit-price">${{ Number(item.price).toFixed(2) }} c/u</span>
              </div>
              
              <div class="qty-controls">
                 <button class="qty-btn" @click="updateQuantity(item.id, -1)">-</button>
                 <span class="qty-value">{{ item.quantity }}</span>
                 <button class="qty-btn" @click="updateQuantity(item.id, 1)">+</button>
              </div>
              
              <span class="cart-item-total">${{ (Number(item.price) * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="sale-totals">
            <div class="totals-breakdown">
              <div class="total-row">
                <span>Subtotal</span>
                <span class="dark-text">${{ subtotal.toFixed(2) }}</span>
              </div>          
            </div>
            
            <div class="grand-total-section">
              <div class="grand-total-info">
                <span class="total-label">TOTAL A PAGAR</span>
                <span class="total-value">${{ total.toFixed(2) }}</span>
              </div>
              <button class="discount-btn" title="Aplicar descuento">
                <TagIcon class="w-5 h-5" />
              </button>
            </div>
            <AppButton
              class="btn-checkout"
              variant="fill"
              fullWidth
              :disabled="cart.length === 0"
              :loading="isSubmitting"
              @click="handleCheckout"
            >
              FINALIZAR VENTA
              <ArrowRightIcon class="w-5 h-5" />
            </AppButton>
         </div>
        </div>
      </div>

      <div v-else class="empty-state">
         <div class="warning-icon-bg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-orange-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
         </div>
         <h2 class="text-2xl font-bold mt-4">Caja Cerrada</h2>
         <p class="text-gray-500 max-w-sm mt-2">Para poder realizar ventas, primero debes abrir tu turno y registrar tu fondo de caja inicial.</p>
         <button class="btn-checkout mt-6" style="padding: 1rem 2rem; border-radius: 8px; background: var(--color-brand-main); color: white; cursor: pointer; border: none; font-weight: bold;" @click="goToShifts">
            Ir a Abrir Turno
         </button>
      </div>
  </div>
  </div>

  <!-- Mobile/Tablet: Fullscreen view -->
  <div v-else-if="isOpen && isMobileOrTablet" style="position: fixed; inset: 0; background: var(--color-background); z-index: 999;">
    <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
      <!-- Modal Header -->
      <div class="modal-header" style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
        <h2 class="modal-title">Punto de Venta</h2>
        <button class="modal-close-btn" @click="$emit('close')" title="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isInitializing" class="empty-state" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
         <div class="flex justify-center items-center">
            <svg class="animate-spin h-12 w-12" style="color: var(--color-brand-main)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
         </div>
         <h2 class="text-xl font-bold mt-4" style="color: #374151;">Cargando Terminal...</h2>
         <p class="text-gray-500 max-w-sm mt-2">Sincronizando caja, inventario y ventas recientes.</p>
      </div>

      <div v-else-if="shiftsStore.hasOpenShift" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
        <!-- Mobile doesn't have grid layout - show products vertically -->
        <div style="flex: 1; overflow-y: auto;">
          <!-- Premium Search Section -->
          <div class="search-section" style="margin: 1rem;">
            <div class="search-input-wrapper">
              <MagnifyingGlassIcon class="search-icon" />
              <input 
                v-model="searchQuery"
                @keyup.enter="handleScanSubmit"
                type="text" 
                placeholder="Escanea o busca por producto/SKU..." 
                class="search-input"
              />
            </div>
            <button class="icon-btn scan-btn-premium" title="Escanear con Cámara" @click="isScanning = true">
              <QrCodeIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Products List -->
          <div class="products-list" style="padding: 0 1rem 1rem 1rem;">
             <div v-if="filteredProducts.length === 0" class="empty-state">
               <p v-if="!searchQuery">Empieza a escribir para buscar productos</p>
               <p v-else>No se encontraron productos con "{{ searchQuery }}"</p>
             </div>

             <div v-else class="products-grid">
                <div 
                 v-for="product in filteredProducts" 
                 :key="product.id" 
                 class="product-card"
                 @click="addToCart(product)"
               >
                 <div class="product-image">
                   <img v-if="product.image_url" :src="product.image_url" :alt="product.name">
                   <div v-else class="empty-image">
                     <PhotoIcon class="empty-icon-lg" />
                   </div>
                   <span 
                     class="stock-badge"
                     :class="{ 'badge-low': getAvailableStock(product) <= 10, 'badge-out': getAvailableStock(product) === 0 }"
                   >
                     {{ getAvailableStock(product) }} EN STOCK
                   </span>
                 </div>

                 <div class="product-info">
                   <div class="product-header">
                     <h4 class="product-name">{{ product.name }}</h4>
                     <span class="product-sku">SKU-{{ product.sku }}</span>
                   </div>
                   <div class="product-footer">
                     <span class="product-price">${{ Number(product.price).toFixed(2) }}</span>
                     <button class="add-btn" @click.stop="addToCart(product)">
                       <PlusIcon class="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <!-- Pagination -->
          <Pagination
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.count"
            @update:current-page="goToPage"
            @update:page-size="setPageSize"
          />
        </div>

        <!-- Cart Summary - Collapsible Drawer at bottom -->
        <div style="background: var(--color-card-stats-fill); border-top: 1px solid #e5e7eb; max-height: 85vh; display: flex; flex-direction: column;">
          <!-- Collapsed/Header State -->
          <div 
            @click="isCartExpanded = !isCartExpanded"
            style="padding: 1.25rem 1rem 1rem; cursor: pointer; user-select: none; position: relative; display: flex; justify-content: space-between; align-items: center; transition: background-color 0.2s;"
            :style="{ backgroundColor: isCartExpanded ? '#f3f4f6' : 'transparent' }"
          >
            <!-- Modern Drag Handle -->
            <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 40px; height: 5px; background-color: #d1d5db; border-radius: 99px;"></div>

            <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1;">
              <ShoppingCartIcon style="width: 24px; height: 24px;" />
              <span style="font-weight: 600; color: #1f2937;">{{ cart.length }} productos</span>
            </div>
            <span style="font-weight: 700; font-size: 1.25rem; color: var(--color-brand-main);">${{ total.toFixed(2) }}</span>
          </div>

          <!-- Expanded State - Cart Items & Checkout -->
          <div 
            class="mobile-cart-drawer"
            :class="{ 'is-expanded': isCartExpanded }"
          >
            <!-- Cart Items -->
            <div style="flex: 1; overflow-y: auto; padding: 0 1rem;">
              <div v-if="cart.length === 0" style="padding: 1rem 0; text-align: center; color: #6b7280;">
                <p>Agrega productos a la venta</p>
              </div>

              <div v-else style="display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem 0;">
                <div 
                  v-for="item in cart" 
                  :key="item.id" 
                  style="display: flex; gap: 0.75rem; padding: 0.75rem; background: white; border-radius: 8px; align-items: start;"
                >
                  <!-- Product Image -->
                  <div style="width: 60px; height: 60px; flex-shrink: 0; border-radius: 6px; overflow: hidden; background: #f3f4f6;">
                    <img 
                      v-if="item.image_url" 
                      :src="item.image_url" 
                      :alt="item.name"
                      style="width: 100%; height: 100%; object-fit: cover;"
                    >
                    <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                      <PhotoIcon style="width: 24px; height: 24px; color: #9ca3af;" />
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; color: #1f2937; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.name }}</p>
                    <p style="font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0 0 0;">${{ Number(item.price).toFixed(2) }} c/u</p>
                  </div>

                  <!-- Quantity Controls -->
                  <div style="display: flex; align-items: center; gap: 0.5rem; background: #f3f4f6; border-radius: 6px; padding: 0.25rem;">
                    <button 
                      @click="updateQuantity(item.id, -1)"
                      style="width: 28px; height: 28px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #6b7280;"
                    >
                      −
                    </button>
                    <span style="width: 32px; text-align: center; font-weight: 600; color: #1f2937;">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item.id, 1)"
                      style="width: 28px; height: 28px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #6b7280;"
                    >
                      +
                    </button>
                  </div>

                  <!-- Subtotal -->
                  <div style="text-align: right; flex-shrink: 0;">
                    <p style="font-weight: 700; color: var(--color-brand-main); margin: 0;">${{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Checkout Button - Always Visible -->
          <div style="padding: 1rem; border-top: 1px solid #e5e7eb; flex-shrink: 0;">
            <AppButton
              class="btn-checkout"
              variant="fill"
              fullWidth
              :disabled="cart.length === 0"
              :loading="isSubmitting"
              @click="handleCheckout"
            >
              FINALIZAR VENTA
            </AppButton>
          </div>
        </div>
      </div>

      <div v-else style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
         <div class="warning-icon-bg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-orange-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
         </div>
         <h2 class="text-2xl font-bold mt-4">Caja Cerrada</h2>
         <p class="text-gray-500 max-w-sm mt-2">Para poder realizar ventas, primero debes abrir tu turno y registrar tu fondo de caja inicial.</p>
         <button class="btn-checkout mt-6" style="padding: 1rem 2rem; border-radius: 8px; background: var(--color-brand-main); color: white; cursor: pointer; border: none; font-weight: bold;" @click="goToShifts">
            Ir a Abrir Turno
         </button>
      </div>
    </div>
  </div>

  <!-- Scanner Overlay para SalesModal - FULLSCREEN en móvil/tablet -->
  <Transition v-if="isMobileOrTablet" name="fade">
    <div v-if="isScanning" style="position: fixed; inset: 0; background: white; z-index: 1050; display: flex; flex-direction: column; align-items: stretch; justify-content: stretch;">
      <!-- Header -->
      <div style="padding: 1rem; background: #f3f4f6; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;">
        <h3 style="font-weight: 600; font-size: 1.25rem; margin: 0;">{{ scannerMode === 'continuous' ? 'Escaneo Fijo' : 'Escanear' }}</h3>
        <button @click="isScanning = false" style="background: none; border: none; padding: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <XMarkIcon class="icon" style="width:24px; height:24px;" />
        </button>
      </div>

      <!-- Camera Area (fullscreen) -->
      <div style="flex: 1; overflow: hidden; position: relative; background: #000;">
        <qrcode-stream 
          :key="scannerResetKey"
          @detect="onDecodeSku"
          @error="onError"
          :formats="barcodeFormats"
          :track="paintOutline"
        ></qrcode-stream>
        <div class="scanner-laser"></div>
        
        <!-- Cooldown Overlay para Continuous Mode -->
        <div v-if="scanCooldownActive && scannerMode === 'continuous'" style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; border-radius: 12px; backdrop-filter: blur(3px); z-index: 10;">
          <div style="text-align: center; color: white;">
            <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">⏱</div>
            <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">Espera 2 segundos</p>
            <p style="font-size: 0.875rem; color: #d1d5db;">para escanear el próximo producto</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 1.5rem; background: #f3f4f6; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 0.875rem; text-align: center; margin: 0 0 1rem 0;">{{ scanCooldownActive && scannerMode === 'continuous' ? '⏸ Escáner en pausa...' : 'Apunta usando la cámara de tu dispositivo' }}</p>
        <button @click="isScanning = false" style="background: #ef4444; color: white; padding: 0.75rem; border-radius: 8px; font-weight: 600; width: 100%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <XMarkIcon class="icon" style="width:20px; height:20px;" /> 
          {{ scannerMode === 'continuous' ? 'Desbloquear Escaneo' : 'Cancelar' }}
        </button>
      </div>
    </div>
  </Transition>

  <!-- Scanner Modal para SalesModal - MODAL en desktop -->
  <Transition v-else name="fade">
    <div v-if="isScanning" class="modal-overlay" style="z-index: 1050; display: flex; align-items: center; justify-content: center; flex-direction: column;" @click.self="isScanning = false">
       <div style="background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 400px; display: flex; flex-direction: column; gap: 1rem; align-items: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
         <h3 style="font-weight: 600; font-size: 1.25rem;">{{ scannerMode === 'continuous' ? 'Escaneo Fijo' : 'Escanear Producto' }}</h3>
         <p v-if="scannerMode === 'continuous'" style="font-size: 0.875rem; color: #6b7280; text-align: center;">Lecturas continuas sin cerrar</p>
         <div style="width: 100%; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #000; position: relative;">
           <qrcode-stream 
             :key="scannerResetKey"
             @detect="onDecodeSku"
             @error="onError"
             :formats="barcodeFormats"
             :track="paintOutline"
           ></qrcode-stream>
           <div class="scanner-laser"></div>
           
           <!-- Cooldown Overlay para Continuous Mode -->
           <div v-if="scanCooldownActive && scannerMode === 'continuous'" style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; border-radius: 12px; backdrop-filter: blur(3px); z-index: 10;">
             <div style="text-align: center; color: white;">
               <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">⏱</div>
               <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">Espera 2 segundos</p>
               <p style="font-size: 0.875rem; color: #d1d5db;">para escanear el próximo producto</p>
             </div>
           </div>
         </div>
         <p style="color: #6b7280; font-size: 0.875rem; text-align: center;">{{ scanCooldownActive && scannerMode === 'continuous' ? '⏸ Escáner en pausa...' : 'Apunta usando la cámara de tu dispositivo' }}</p>
         <button @click="isScanning = false" style="background: #f1f5f9; padding: 0.75rem; border-radius: 8px; font-weight: 600; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
           <XMarkIcon class="icon" style="width:20px; height:20px;" /> 
           {{ scannerMode === 'continuous' ? 'Desbloquear Escaneo' : 'Cancelar' }}
         </button>
       </div>
    </div>
  </Transition>

  <SaleSuccessModal 
    :is-open="showSuccessModal"
    :cart="lastCartSnapshot"
    :total="lastTotal"
    :sale-id="lastSaleId"
    @close="handleCloseSuccess"
    @revert="handleRevert"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Pusher from 'pusher-js';
import { useAuth } from '@/composables/useAuth';
import { useProducts } from '@/composables/useProducts';
import SaleSuccessModal from '@/components/SaleSuccessModal.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useSalesStore } from '@/stores/sales.store';
import { useShiftsStore } from '@/stores/shifts.store';
import { useRouter } from 'vue-router';
import Pagination from '@/components/ui/Pagination.vue';
import {
  MagnifyingGlassIcon,
  QrCodeIcon,
  FunnelIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  TagIcon,
  ArrowRightIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import apiClient from '@/services/api';
import { QrcodeStream } from 'vue-qrcode-reader';
import type { Product } from '@/composables/useProducts';

const { enqueueSnackbar } = useSnackbar();
const { currentUser } = useAuth();
const salesStore = useSalesStore();
const shiftsStore = useShiftsStore();
const router = useRouter();

// Usar mismo composable que Inventario para sincronizar stock con paginación
const { products: apiProducts, fetchProducts, pagination, goToPage, setPageSize } = useProducts();

interface CartItem extends Product {
  quantity: number;
}

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'sale-completed', 'sale-reverted']);

const searchQuery = ref('');
const cart = ref<CartItem[]>([]);
const showSuccessModal = ref(false);
const isInitializing = ref(true);

const localDeviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
let isRemoteUpdate = false;

const syncCartToBackend = async () => {
  if (isRemoteUpdate) return;
  try {
    await apiClient.post('/products/sync-cart/', {
      cart: cart.value,
      device_id: localDeviceId
    });
  } catch (error) {
    console.error("Error transmitiendo carrito:", error);
  }
};

// Snapshot de la última venta (para poder revertirla)
const lastSaleId = ref<string | number>('');
const lastCartSnapshot = ref<CartItem[]>([]);
const lastTotal = ref(0);
const isSubmitting = ref(false);

const isScanning = computed({
  get: () => salesStore.isScannerOpen,
  set: (val) => { salesStore.isScannerOpen = val; }
});

const scannerMode = computed(() => salesStore.scannerMode);

const scanCooldownActive = ref(false); // Cooldown visual para continuous mode
const scannerResetKey = ref(0); // Key para remount del escáner

// Detectar si es móvil o tablet (viewport menor a 1024px)
const isMobileOrTablet = ref(false);
const checkDeviceSize = () => {
  isMobileOrTablet.value = window.innerWidth < 1024;
};

// Carrito colapsable en móvil/tablet
const isCartExpanded = ref(false);

const barcodeFormats = ref<any[]>([
  'qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e'
]);

const onError = (err: any) => {
  isScanning.value = false;
  let errMsg = 'Error con la cámara: ';
  if (err.name === 'NotAllowedError') errMsg += 'Permiso denegado.';
  else if (err.name === 'NotFoundError') errMsg += 'No se encontró cámara.';
  else if (err.name === 'NotSupportedError') errMsg += 'Contexto no seguro (HTTPS requerido).';
  else if (err.name === 'NotReadableError') errMsg += 'Cámara en uso.';
  else errMsg += err.message || err.name;
  alert(errMsg);
};

const paintOutline = (detectedCodes: any[], ctx: CanvasRenderingContext2D) => {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y);
    }
    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.closePath();
    ctx.stroke();
  }
};

const handleScanSubmit = () => {
  const query = searchQuery.value.trim();
  if (query) {
    processScan(query);
  }
};

const onDecodeSku = (detectedCodes: any[]) => {
  // Si está en cooldown y es continuous mode, no procesar
  if (scanCooldownActive.value && scannerMode.value === 'continuous') {
    return;
  }

  if (detectedCodes.length > 0) {
    const sku = detectedCodes[0].rawValue;
    
    // En modo single: detener cámara
    // En modo continuous: seguir escaneando pero activar cooldown
    if (scannerMode.value === 'single') {
      isScanning.value = false;
    } else if (scannerMode.value === 'continuous') {
      // Activar cooldown de 2 segundos en continuous mode
      scanCooldownActive.value = true;
      setTimeout(() => {
        scanCooldownActive.value = false;
        // Reiniciar el componente del escáner cuando termina el cooldown
        scannerResetKey.value++;
      }, 2000);
    }
    
    processScan(sku);
  }
};

const processScan = async (sku: string, isRemoteScan: boolean = false) => {
  try {
    // 1. Intento de búsqueda local (rápido y a prueba de fallos con códigos de barra largos)
    let productFound = apiProducts.value?.find((p: any) => p.sku === sku || p.name.toLowerCase() === sku.toLowerCase() || String(p.barcode) === sku);

    // 2. Si no está en memoria local, buscarlo en el backend vía GET
    if (!productFound) {
      const res = await apiClient.get<any>(`/products/?search=${sku}`);
      if (res.success && res.data && res.data.results && res.data.results.length > 0) {
        productFound = res.data.results[0] as Product;
      }
    }

    if (productFound) {
      const audio = new Audio('/sounds/Fx_Scanning.wav');
      audio.play().catch(e => console.error(e));
      
      // Agregar al carrito
      addToCart(productFound);
      
      // SOLO hacer POST si es un escaneo local (no remoto vía websocket)
      // Esto previene duplicados cuando el backend dispara el evento Pusher
      if (!isRemoteScan) {
        // En modo continuo: timeout más largo (5s) | En modo single: timeout normal (3s)
        const timeoutDuration = scannerMode.value === 'continuous' ? 5000 : 3000;
        if (scannerMode.value !== 'continuous') {
          searchQuery.value = '';
        }
        
        scanState.isLocal = true;
        setTimeout(() => scanState.isLocal = false, timeoutDuration);

        // Avisar a otras pestañas con device_id para evitar duplicación
        apiClient.post<any>('/products/scan/', { 
          sku: productFound.sku,
          device_id: localDeviceId 
        }).catch(() => {});
      }
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Producto no encontrado',
        message: 'Asegúrate de que el código de barras o SKU estén registrados correctamente.',
        duration: 4000
      });
    }
  } catch(e) {
    console.error("Scan error:", e);
  }
};

const goToShifts = () => {
  emit('close');
  router.push('/dashboard/shifts');
};

const filteredProducts = computed(() => {
  if (!apiProducts.value || apiProducts.value.length === 0) return [];
  
  const query = searchQuery.value.toLowerCase().trim();
  
  if (!query) return apiProducts.value;
  
  return apiProducts.value.filter(product => {
    const nameStr = product.name ? String(product.name).toLowerCase() : '';
    const skuStr = product.sku ? String(product.sku).toLowerCase() : '';
    return nameStr.includes(query) || skuStr.includes(query);
  });
});

// Helper to calculate available stock visually
const getAvailableStock = (product: Product) => {
  const item = cart.value.find(i => i.id === product.id);
  const reserved = item ? item.quantity : 0;
  return product.stock - reserved;
};

// Cart Logic
const addToCart = (product: Product) => {
  const available = getAvailableStock(product);
  
  if (available <= 0) {
      enqueueSnackbar({
        type: 'warning',
        title: 'Stock Insuficiente',
        message: `No hay más stock disponible de ${product.name}`,
        duration: 2000
      });
      return; 
  }
  
  const existingItem = cart.value.find(item => item.id === product.id);
  
  if (existingItem) {
      existingItem.quantity++;
      enqueueSnackbar({
        type: 'success',
        title: 'Cantidad Actualizada',
        message: `Se agregó una unidad más de ${product.name}`,
        duration: 1500
      });
  } else {
    cart.value.push({ ...product, quantity: 1 });
    enqueueSnackbar({
      type: 'success',
      title: 'Producto Agregado',
      message: `${product.name} agregado a la venta`,
      duration: 1500
    });
  }
  
  syncCartToBackend();
};

const removeFromCart = (id: string | number) => {
  cart.value = cart.value.filter(item => item.id !== id);
  syncCartToBackend();
};

const clearCart = () => {
  cart.value = [];
  syncCartToBackend();
};

const updateQuantity = (id: string | number, delta: number) => {
  const item = cart.value.find(item => item.id === id);
  if (!item) return;
  
  const newQuantity = item.quantity + delta;
  
  if (newQuantity <= 0) {
    removeFromCart(id);
  } else if (newQuantity <= item.stock) {
    item.quantity = newQuantity;
    syncCartToBackend();
  }
};

// Computed Totals
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});

const tax = computed(() => {
  return subtotal.value * 0.0;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const handleCheckout = async () => {
  if (cart.value.length === 0 || isSubmitting.value) return;
  isSubmitting.value = true;
  
  try {
    // Play sound
    const audio = new Audio('/sounds/Fx_Sucess.wav');
    audio.play().catch(e => console.error('Error playing sound:', e));

  // Guardar snapshot de la venta antes de registrarla
  lastCartSnapshot.value = [...cart.value];
  lastTotal.value = Number(total.value.toFixed(2));
  
  const trxId = `TRX-${Date.now()}`;

  // Register sale in store via API
  const result = await salesStore.addSale({
    transaction_id: trxId,
    user: currentUser.value?.id || 1, // Se extrae del auth store
    status: 'completed',
    total: lastTotal.value,
    device_id: localDeviceId, // Incluir device_id para identificar quién hizo la venta
    items: cart.value.map(item => ({ 
        product: Number(item.id),
        quantity: item.quantity,
        unit_price: Number(item.price)
    }))
  });
  
  if (result.success && result.transaction_id) {
    lastSaleId.value = result.id as number | string;
    // Emit sale completed event (descuenta stock visualmente)
    emit('sale-completed', [...cart.value]);
    
    // Show success modal
    showSuccessModal.value = true;
  } else {
    enqueueSnackbar({
      type: 'error',
      title: 'Venta Fallida',
      message: result.error || 'Ocurrió un error al procesar la venta.',
      duration: 5000
    });
  }
  } finally {
    isSubmitting.value = false;
  }
};

const handleCloseSuccess = () => {
  showSuccessModal.value = false;
  clearCart(); // Usamos clearCart para detonar el sync vacío al servidor
  emit('close'); // Close sales modal
};

const handleRevert = (saleId: string | number, cartItems: { id: string | number; name: string; price: string | number; quantity: number }[]) => {
  showSuccessModal.value = false;
  cart.value = cartItems as CartItem[]; // Cargamos los datos reverted
  syncCartToBackend(); // Sincronizamos al backend para reflejarlo en todos frentes
  emit('sale-reverted', saleId, cartItems);
  emit('close');
};

let pusher: Pusher | null = null;
let channel: any = null;
let channelName = '';
// Bandera para evitar duplicados - se usa dentro de closures en los handlers de Pusher
const scanState = { isLocal: false };
let lastScannedSku = ''; // Prevenir procesar el mismo SKU 2 veces

onMounted(async () => {
  isInitializing.value = true;
  try {
    // 1. Verificar estado de caja obligatoriamente para evitar falsos "Caja Cerrada"
    await shiftsStore.fetchShifts();

    // 2. Cargar productos desde API sin paginación
    await fetchProducts();

    // 3. Cargar el carrito guardado en la Base de Datos (si existe)
    const res = await apiClient.get<any>('/products/my-cart/');
    if (res.success && res.data && res.data.cart && res.data.cart.length > 0) {
      isRemoteUpdate = true;
      cart.value = res.data.cart;
      isRemoteUpdate = false;
    }
  } catch (e) {
    console.error("Error al inicializar Punto de Venta:", e);
  } finally {
    isInitializing.value = false;
  }

  // Detectar tamaño del dispositivo
  checkDeviceSize();
  window.addEventListener('resize', checkDeviceSize);

  const userId = currentUser.value?.id || 1;
  const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY || '2123775';
  const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'us2';

  pusher = new Pusher(pusherKey, {
    cluster: pusherCluster,
    forceTLS: true
  });
  
  channelName = `pos-user-${userId}`;
  channel = pusher.subscribe(channelName);
  
  channel.bind('PRODUCT_SCANNED', (data: any) => {
    // Si el escaneo vino de este dispositivo, ignora completamente
    if (data.device_id === localDeviceId) {
      return; // El isLocalScan ya maneja esto, pero double-check
    }
    
    // Evitar procesar el mismo SKU dos veces en rápida sucesión desde otro dispositivo
    if (data && data.sku === lastScannedSku) {
      return;
    }
    
    lastScannedSku = data?.sku || '';
    console.log("[Pusher] Producto escaneado remotamente desde otro dispositivo:", data);
    
    // IMPORTANTE: Solo agregar el producto del evento de Pusher
    // No intentar hacer otro POST ni procesamiento local simultáneo
    if (data && data.product) {
       addToCart(data.product);
       const audio = new Audio('/sounds/Fx_Scanning.wav');
       audio.play().catch(e => console.error(e));
    } else if (data && data.sku) {
       // Buscar local en fallback, pero sin emitir otro POST
       const skuToFind = data.sku;
       const localProduct = apiProducts.value?.find((p: any) => p.sku === skuToFind || p.name.toLowerCase() === skuToFind.toLowerCase() || String(p.barcode) === skuToFind);
       if (localProduct) {
          addToCart(localProduct);
          const audio = new Audio('/sounds/Fx_Scanning.wav');
          audio.play().catch(e => console.error(e));
       }
    }
  });

  // -------------------------------------------------------------
  // B. Escuchar cambios de Carrito de otro dispositivo
  // -------------------------------------------------------------
  channel.bind('CART_UPDATED', (data: any) => {
    const nuevoCarrito = data.cart;
    const fromDeviceId = data.device_id;
    
    // Si the device_id no es igual a nuestro localDeviceId
    if (fromDeviceId !== localDeviceId && nuevoCarrito) {
      isRemoteUpdate = true;
      cart.value = nuevoCarrito;
      isRemoteUpdate = false; // Restablecer bandera tras actualización síncrona
      console.log("Carrito sincronizado por actualización remota de otro dispositivo.");
    }
  });

  // Evento: INVENTORY_UPDATED
  // Enviado por backend cuando se vende, devuelve o modifica un producto
  // Dispara automáticamente cuando se completa una venta en otro dispositivo
  channel.bind('INVENTORY_UPDATED', async (data: any) => {
    console.log("[SalesModal] Evento INVENTORY_UPDATED recibido:", data);
    // Refrescar listado de productos para actualizar stock
    try {
      // Refrescar la página actual de productos
      await fetchProducts();
      console.log("[SalesModal] Productos refrescados tras evento de inventario");
    } catch (err) {
      console.error("[SalesModal] Error refrescando productos:", err);
    }
  });

  // Evento: SALES_COMPLETED
  // Enviado por backend cuando otra sesión completa una venta
  // Contenido: transaction_id, total, items_count, timestamp, device_id
  channel.bind('SALES_COMPLETED', (data: any) => {
    console.log("[SalesModal] Venta completada:", data);
    
    // Solo mostrar snackbar si la venta fue de OTRA sesión (diferente device_id)
    if (data.device_id && data.device_id !== localDeviceId && data.device_id !== 'server-action') {
      //"device_id es diferente, significa que es de otra sesión
      enqueueSnackbar({
        type: 'info',
        title: 'Venta Completada desde Otra Sesión',
        message: `Transacción: ${data.transaction_id} - Total: $${data.total}`,
        duration: 4000
      });
    } else if (data.device_id === 'server-action') {
      // Acción desde el servidor (adminitrador completando venta)
      enqueueSnackbar({
        type: 'info',
        title: 'Venta Completada desde Servidor',
        message: `Transacción: ${data.transaction_id} - Total: $${data.total}`,
        duration: 4000
      });
    }
    // Si device_id === localDeviceId, NO mostrar (fue esta sesión la que la hizo)
  });

  // Evento: SALES_CANCELLED
  // Enviado por backend cuando una venta se cancela
  // Contenido: transaction_id, timestamp, device_id
  channel.bind('SALES_CANCELLED', (data: any) => {
    console.log("[SalesModal] Venta cancelada:", data);
    
    // Solo mostrar snackbar si la cancelación fue de OTRA sesión
    if (data.device_id && data.device_id !== localDeviceId) {
      enqueueSnackbar({
        type: 'warning',
        title: 'Venta Cancelada desde Otra Sesión',
        message: `Transacción: ${data.transaction_id}`,
        duration: 4000
      });
    }
    // Si device_id === localDeviceId, NO mostrar (fue esta sesión la que la canceló)
  });
});

onUnmounted(() => {
  if (channelName && pusher) {
    pusher.unsubscribe(channelName);
    pusher.disconnect();
  }
  window.removeEventListener('resize', checkDeviceSize);
});
</script>

<style scoped>
/* =====================
   Overlay & Modal Shell
   ===================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* =====================
   Modal Header
   ===================== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.02em;
}

.modal-close-btn {
  background: #ffffff;
  color: #9ca3af;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: var(--color-card-stats-fill);
}

.modal-close-btn svg {
  width: 24px;
  height: 24px;
}

.modal-content {
  background: var(--color-background);
  width: 95%;
  max-width: 1200px;
  height: 90vh;
  max-height: 850px;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  padding: 1.5rem 2rem;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* =====================
   Modal Body Layout
   ===================== */
.sale-layout {
  display: grid;
  grid-template-columns: 2fr 1.1fr;
  gap: 2rem;
  height: 100%;
  min-height: 0;
}

/* =====================
   Left Panel
   ===================== */
.left-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* =====================
   Search Section
   ===================== */
.search-section {
  background: var(--color-card-stats-fill);
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
  border-radius: 24px;
  flex-shrink: 0;
  padding: 1rem;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 99px;
  padding: 0.8rem 1.25rem;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.search-input-wrapper:focus-within {
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  color: #1f2937;
  min-width: 0;
}

.search-input::placeholder {
  color: #9ca3af;
}

.icon-btn {
  width: 48px;
  height: 48px;
  background: #ffffff;
  color: #4b5563;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: all 0.2s;
  flex-shrink: 0;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
  transform: translateY(-1px);
}

/* =====================
   Product Grid
   ===================== */
.products-list {
  background:var(--color-card-stats-fill) ;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 0.5rem;
  margin-right: -0.5rem;
  border-radius: 24px;
  padding: 1rem;
}

.products-list::-webkit-scrollbar { width: 6px; }
.products-list::-webkit-scrollbar-track { background: transparent; }
.products-list::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
.products-list::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.25rem;
  padding-bottom: 1rem;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  text-align: center;
  gap: 1rem;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  opacity: 0.5;
}

/* =====================
   Product Card
   ===================== */
.product-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.02);
}

.product-card:hover {
  box-shadow: 0 12px 24px rgba(0,0,0,0.06);
}

.product-image {
  position: relative;
  height: 160px;
  background: #f8fafc;
  width: 100%;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.empty-image {
  width: 100%;
  height: 100%;
  background: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon-lg {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  opacity: 0.5;
}

.empty-icon-sm {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  opacity: 0.7;
}


/* ── Floating stock badge ── */
.stock-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.6rem;
  border-radius: 99px;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stock-badge.badge-low { background: #fef08a; color: #854d0e; }
.stock-badge.badge-out { background: #fee2e2; color: #b91c1c; }

/* Info area */
.product-info {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.product-header {
  margin-bottom: 0.75rem;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.2rem;
}

.product-sku {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Bottom row: price + add button */
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-weight: 800;
  font-size: 1.125rem;
  color: #06402B;
  letter-spacing: -0.01em;
}

.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--color-brand-main-gradient);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.product-card:hover .add-btn {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.add-btn svg { width: 16px; height: 16px; }

/* =====================
   Right Panel — Cart
   ===================== */
.right-panel {
  background: var(--color-card-stats-fill);
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  height: 100%;
}

.cart-header {
  padding: 1.5rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-card-stats-fill);
  flex-shrink: 0;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #1f2937;
}

.cart-icon {
  width: 22px;
  height: 22px;
  color: #06402B;
}

.cart-title h3 {
  font-size: 1.125rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
}

.clear-cart-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
}

.clear-cart-btn:hover:not(:disabled) {
  color: #ef4444;
  background: #fef2f2;
}

.clear-cart-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.clear-cart-btn svg {
  width: 20px;
  height: 20px;
}

.sale-items-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-muted {
  color: #9ca3af;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Cart items */
.cart-items-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 1.75rem;
}

.cart-items-container::-webkit-scrollbar { width: 4px; }
.cart-items-container::-webkit-scrollbar-track { background: transparent; }
.cart-items-container::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f8fafc;
  flex-shrink: 0;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1.5; /* slightly larger space for name relative to qty */
}

.cart-item-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-unit-price {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Qty controls */
.qty-controls {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 99px;
  padding: 0.25rem 0.6rem;
  gap: 0.75rem;
  border: 1px solid #f1f5f9;
}

.qty-btn {
  background: none;
  border: none;
  color: #4b5563;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.qty-btn:hover {
  color: #111827;
}

.qty-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  min-width: 1rem;
  text-align: center;
}

.cart-item-total {
  font-weight: 800;
  color: #1f2937;
  font-size: 1rem;
  margin-left: auto; /* Push to right */
  min-width: 60px;
  text-align: right;
}

/* =====================
   Totals & Checkout
   ===================== */
.sale-totals {
  padding: 1.5rem 1.75rem 1.75rem;
  background: var(--color-card-stats-fill);
  border-top: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.totals-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #6b7280;
}

.dark-text {
  font-weight: 700;
  color: #374151;
}

.grand-total-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.grand-total-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.total-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.total-value {
  font-size: 2rem;
  font-weight: 900;
  color: #06402B;
  line-height: 1;
  letter-spacing: -0.02em;
}

.discount-btn {
  width: 44px;
  height: 44px;
  background: #f1f5f9;
  color: #0f172a;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.discount-btn:hover {
  background: #e2e8f0;
}

.discount-btn svg {
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
}

/* Checkout Button */
.btn-checkout {
  width: 100%;
  color: white;
  border: none;
  padding: 1.15rem;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-checkout:active:not(:disabled) {
  transform: translateY(0);
}

.btn-checkout svg {
  width: 22px;
  height: 22px;
}

.btn-checkout:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

/* =====================
   Responsive
   ===================== */
@media (max-width: 1024px) {
  .sale-layout {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    padding: 1rem 0.5rem;
  }
  
  .modal-header {
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .sale-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 80%;
    overflow: hidden; /* Prevent full-page scroll */
  }
  
  .left-panel {
    flex: 1;
    min-height: 0;
    overflow: hidden; /* Allow internal scrolling in products-list */
    display: flex;
    flex-direction: column;
  }

  .right-panel {
    flex: 1; /* Ocupar el espacio disponible */
    overflow: hidden;
  }

  .search-section {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    border-radius: 16px;
  }

  .search-input-wrapper {
    padding: 0.6rem 1rem;
  }

  .search-input {
    height: 38px;
    font-size: 0.9rem;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
  }
  
  .products-list {
    overflow-y: auto; /* Scroll ONLY the products */
    padding: 0.75rem;
    flex: 1;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding-bottom: 1rem;
  }

  .product-image {
    min-height: 100px;
  }

  .product-name {
    font-size: 0.85rem;
  }
  
  .product-sku {
    font-size: 0.65rem;
  }

  .product-header {
    margin-bottom: 0.4rem;
  }

  .product-price {
    font-size: 0.95rem;
  }

  .add-btn {
    width: 32px;
    height: 32px;
  }

  .cart-header {
    padding: 1rem;
  }

  .cart-items-container {
    overflow-y: auto; /* Internal scrolling for cart items too */
    padding: 0 1rem;
  }

  .cart-item {
    padding: 0.75rem 0;
    gap: 0.5rem;
  }
  
  .cart-item-image {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }
  
  .cart-item-name {
    font-size: 0.85rem;
  }

  .qty-controls {
    gap: 0.5rem;
  }

  .qty-btn {
    width: 24px;
    height: 24px;
    font-size: 1rem;
  }

  .qty-value {
    width: 1.5rem;
  }

  .sale-totals {
    padding: 1rem;
    margin-top: auto;
  }

  .btn-checkout {
    padding: 0.9rem;
    font-size: 0.95rem;
    border-radius: 12px;
  }
}

/* Scanner Laser Animation */
.scanner-laser {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #22c55e;
  box-shadow: 0 0 10px 2px rgba(34, 197, 94, 0.5);
  animation: scan-laser 2s infinite linear;
  pointer-events: none;
  z-index: 10;
}

@keyframes scan-laser {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* Drawer Animations */
.mobile-cart-drawer {
  display: flex;
  flex-direction: column;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-cart-drawer.is-expanded {
  max-height: 70vh; /* max possible height */
}
</style>