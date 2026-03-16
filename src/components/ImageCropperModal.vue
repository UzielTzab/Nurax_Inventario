<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="cropper-overlay" @click.self="$emit('cancel')">
        <div class="cropper-modal">
          <!-- Header -->
          <div class="cropper-header">
            <h3>Recortar Imagen</h3>
            <button class="cropper-close" @click="$emit('cancel')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Contenedor de recorte -->
          <div class="cropper-container">
            <div class="cropper-canvas-wrapper" ref="wrapperRef">
              <canvas 
                ref="canvasRef"
                class="cropper-canvas"
              ></canvas>
              
              <!-- Overlay para el área de recorte -->
              <div class="cropper-overlay-area" v-if="imageWidth > 0">
                <!-- Área oscura alrededor -->
                <div 
                  class="cropper-dark-area cropper-dark-top"
                  :style="{ height: (cropArea.y * displayScale) + 'px' }"
                ></div>

                <!-- Área de recorte con controles -->
                <div 
                  class="cropper-crop-area"
                  :style="{
                    top: (cropArea.y * displayScale) + 'px',
                    left: (cropArea.x * displayScale) + 'px',
                    width: (cropArea.size * displayScale) + 'px',
                    height: (cropArea.size * displayScale) + 'px'
                  }"
                >
                  <!-- Líneas de guía (grid) -->
                  <div class="cropper-grid">
                    <div class="cropper-grid-line cropper-grid-horizontal"></div>
                    <div class="cropper-grid-line cropper-grid-horizontal"></div>
                    <div class="cropper-grid-line cropper-grid-vertical"></div>
                    <div class="cropper-grid-line cropper-grid-vertical"></div>
                  </div>

                  <!-- Resize handles en las esquinas -->
                  <div 
                    class="cropper-handle cropper-handle-nw"
                    @mousedown="(e) => startResize('nw', e)"
                    @touchstart="(e) => startResize('nw', e)"
                  ></div>
                  <div 
                    class="cropper-handle cropper-handle-ne"
                    @mousedown="(e) => startResize('ne', e)"
                    @touchstart="(e) => startResize('ne', e)"
                  ></div>
                  <div 
                    class="cropper-handle cropper-handle-sw"
                    @mousedown="(e) => startResize('sw', e)"
                    @touchstart="(e) => startResize('sw', e)"
                  ></div>
                  <div 
                    class="cropper-handle cropper-handle-se"
                    @mousedown="(e) => startResize('se', e)"
                    @touchstart="(e) => startResize('se', e)"
                  ></div>

                  <!-- Move handle (todo el área) -->
                  <div 
                    class="cropper-move-handle"
                    @mousedown="startMove"
                    @touchstart="startMove"
                  ></div>
                </div>

                <!-- Áreas oscuras costados -->
                <div 
                  class="cropper-dark-area cropper-dark-bottom"
                  :style="{ top: ((cropArea.y + cropArea.size) * displayScale) + 'px', height: ((imageHeight - (cropArea.y + cropArea.size)) * displayScale) + 'px' }"
                ></div>
              </div>
            </div>

            <!-- Panel de controles (derecha) -->
            <div class="cropper-controls">
              <div class="cropper-control-group">
                <label>Tamaño</label>
                <div class="cropper-size-display">{{ cropArea.size }}x{{ cropArea.size }} px</div>
              </div>

              <div class="cropper-control-group">
                <label>Zoom</label>
                <input 
                  type="range" 
                  :value="scale" 
                  @input="updateScale"
                  class="cropper-slider"
                  min="0.5"
                  max="3"
                  step="0.1"
                />
                <div class="cropper-zoom-label">{{ Math.round(scale * 100) }}%</div>
              </div>

              <div class="cropper-control-group">
                <label>Rotación</label>
                <div class="cropper-rotation-buttons">
                  <AppButton size="sm" @click="rotateImage(-90)" title="Rotar izquierda">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path d="M3 6a3 3 0 013-3h2.25A2.25 2.25 0 0010.5 5.25v.006c0 .649.13 1.27.38 1.84L8.84 10.5A2.25 2.25 0 006.75 10.5H6a3 3 0 01-3-3zm14.25 6a3 3 0 013 3v2.25a2.25 2.25 0 002.25 2.25h.75a3 3 0 013-3v-2.25A2.25 2.25 0 0024 12h-.75a3 3 0 01-3-3z" />
                    </svg>
                  </AppButton>
                  <AppButton size="sm" @click="rotateImage(90)" title="Rotar derecha">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path d="M21 6a3 3 0 01-3 3h-2.25A2.25 2.25 0 0013.5 5.25v-.006c0-.649.13-1.27.38-1.84L15.16 2.5A2.25 2.25 0 0017.25 2.5H18a3 3 0 013 3zM9.75 18a3 3 0 01-3-3v-2.25A2.25 2.25 0 004.5 12h-.75a3 3 0 01-3 3v2.25A2.25 2.25 0 000 18z" />
                    </svg>
                  </AppButton>
                </div>
              </div>

              <div class="cropper-control-group">
                <p class="text-xs text-gray-500">Usa el ratón o toque para mover y redimensionar</p>
              </div>
            </div>
          </div>

          <!-- Footer con botones de acción -->
          <div class="cropper-footer">
            <AppButton variant="outline" @click="$emit('cancel')">Cancelar</AppButton>
            <AppButton @click="confirmCrop">Confirmar Recorte</AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';

interface Props {
  isOpen: boolean;
  imageSrc: string;
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'confirm', croppedImage: Blob): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const scale = ref(1);
const rotation = ref(0);

// Área de recorte (en píxeles de la imagen original, NO escalada)
const cropArea = ref({
  x: 0,
  y: 0,
  size: 300
});

const imageWidth = ref(0);
const imageHeight = ref(0);
const displayScale = ref(1); // Escala de visualización (canvas vs imagen real)

// Estados de interacción
const isResizing = ref(false);
const isMoving = ref(false);
const resizeHandle = ref<string | null>(null);
const startX = ref(0);
const startY = ref(0);

let image: HTMLImageElement | null = null;

// Cargar imagen cuando isOpen cambia
watch(() => props.isOpen, async (newVal: boolean) => {
  if (newVal && props.imageSrc) {
    await loadImage();
  }
}, { immediate: true });

const loadImage = async () => {
  return new Promise<void>((resolve) => {
    image = new Image();
    image.onload = () => {
      imageWidth.value = image!.width;
      imageHeight.value = image!.height;

      // Inicializar área de recorte al centro
      const minDim = Math.min(imageWidth.value, imageHeight.value);
      const initialSize = Math.min(minDim * 0.8, 400);
      cropArea.value = {
        x: (imageWidth.value - initialSize) / 2,
        y: (imageHeight.value - initialSize) / 2,
        size: initialSize
      };

      // Renderar canvas
      setTimeout(() => {
        drawCanvas();
        resolve();
      }, 0);
    };
    image.src = props.imageSrc;
  });
};

const drawCanvas = () => {
  if (!canvasRef.value || !image || !wrapperRef.value) return;

  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  // Calcular tamaño del canvas para que quepa en el contenedor
  const wrapperWidth = wrapperRef.value.clientWidth;
  const wrapperHeight = wrapperRef.value.clientHeight;

  // Calcular la escala para que la imagen quepa completamente
  const scaleX = wrapperWidth / (imageWidth.value * scale.value);
  const scaleY = wrapperHeight / (imageHeight.value * scale.value);
  displayScale.value = Math.min(scaleX, scaleY, 1); // No amplificar más allá del 100%

  const displayWidth = imageWidth.value * scale.value * displayScale.value;
  const displayHeight = imageHeight.value * scale.value * displayScale.value;

  // Establecer el tamaño del canvas
  canvasRef.value.width = displayWidth;
  canvasRef.value.height = displayHeight;

  // Limpiar y aplicar transformaciones
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, displayWidth, displayHeight);

  ctx.save();
  ctx.translate(displayWidth / 2, displayHeight / 2);
  ctx.rotate((rotation.value * Math.PI) / 180);
  ctx.drawImage(
    image,
    (-imageWidth.value * scale.value * displayScale.value) / 2,
    (-imageHeight.value * scale.value * displayScale.value) / 2,
    imageWidth.value * scale.value * displayScale.value,
    imageHeight.value * scale.value * displayScale.value
  );
  ctx.restore();
};

const updateScale = (e: Event) => {
  scale.value = parseFloat((e.target as HTMLInputElement).value);
  drawCanvas();
};

const rotateImage = (angle: number) => {
  rotation.value = (rotation.value + angle) % 360;
  drawCanvas();
};

const startResize = (handle: string, e: Event) => {
  const mouseEvent = e as MouseEvent;
  const touchEvent = e as TouchEvent;
  isResizing.value = true;
  resizeHandle.value = handle;
  startX.value = mouseEvent.clientX || touchEvent.touches?.[0]?.clientX || 0;
  startY.value = mouseEvent.clientY || touchEvent.touches?.[0]?.clientY || 0;

  document.addEventListener('mousemove', handleResizeMove);
  document.addEventListener('mouseup', endResize);
  document.addEventListener('touchmove', handleResizeMove, { passive: false });
  document.addEventListener('touchend', endResize);
};

const handleResizeMove = (e: MouseEvent | TouchEvent) => {
  if (!isResizing.value) return;

  const mouseEvent = e as MouseEvent;
  const touchEvent = e as TouchEvent;
  const clientX = mouseEvent.clientX || touchEvent.touches?.[0]?.clientX || 0;
  const clientY = mouseEvent.clientY || touchEvent.touches?.[0]?.clientY || 0;

  const deltaX = (clientX - startX.value) / displayScale.value;
  const deltaY = (clientY - startY.value) / displayScale.value;

  const minSize = 50;
  const maxSize = Math.min(imageWidth.value, imageHeight.value);

  // El resize siempre debe mantener la forma cuadrada
  if (resizeHandle.value === 'se') {
    const newSize = Math.min(
      Math.max(minSize, cropArea.value.size + deltaX),
      maxSize - cropArea.value.x
    );
    cropArea.value.size = newSize;
  } else if (resizeHandle.value === 'sw') {
    const newSize = Math.min(
      Math.max(minSize, cropArea.value.size - deltaX),
      maxSize
    );
    cropArea.value.x = Math.max(0, cropArea.value.x + deltaX);
    cropArea.value.size = newSize;
  } else if (resizeHandle.value === 'ne') {
    const newSize = Math.min(
      Math.max(minSize, cropArea.value.size + deltaX),
      maxSize
    );
    cropArea.value.y = Math.max(0, cropArea.value.y - deltaY);
    cropArea.value.size = newSize;
  } else if (resizeHandle.value === 'nw') {
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    const newSize = Math.min(
      Math.max(minSize, cropArea.value.size - delta),
      maxSize
    );
    cropArea.value.x = Math.max(0, cropArea.value.x + delta);
    cropArea.value.y = Math.max(0, cropArea.value.y + delta);
    cropArea.value.size = newSize;
  }

  startX.value = clientX;
  startY.value = clientY;
};

const endResize = () => {
  isResizing.value = false;
  resizeHandle.value = null;
  document.removeEventListener('mousemove', handleResizeMove);
  document.removeEventListener('mouseup', endResize);
  document.removeEventListener('touchmove', handleResizeMove);
  document.removeEventListener('touchend', endResize);
};

const startMove = (e: Event) => {
  const mouseEvent = e as MouseEvent;
  const touchEvent = e as TouchEvent;
  isMoving.value = true;
  startX.value = mouseEvent.clientX || touchEvent.touches?.[0]?.clientX || 0;
  startY.value = mouseEvent.clientY || touchEvent.touches?.[0]?.clientY || 0;

  document.addEventListener('mousemove', handleMoveMove);
  document.addEventListener('mouseup', endMove);
  document.addEventListener('touchmove', handleMoveMove, { passive: false });
  document.addEventListener('touchend', endMove);
};

const handleMoveMove = (e: MouseEvent | TouchEvent) => {
  if (!isMoving.value) return;

  const mouseEvent = e as MouseEvent;
  const touchEvent = e as TouchEvent;
  const clientX = mouseEvent.clientX || touchEvent.touches?.[0]?.clientX || 0;
  const clientY = mouseEvent.clientY || touchEvent.touches?.[0]?.clientY || 0;

  const deltaX = (clientX - startX.value) / displayScale.value;
  const deltaY = (clientY - startY.value) / displayScale.value;

  // Limitar el movimiento dentro de los límites de la imagen
  cropArea.value.x = Math.max(0, Math.min(cropArea.value.x + deltaX, imageWidth.value - cropArea.value.size));
  cropArea.value.y = Math.max(0, Math.min(cropArea.value.y + deltaY, imageHeight.value - cropArea.value.size));

  startX.value = clientX;
  startY.value = clientY;
};

const endMove = () => {
  isMoving.value = false;
  document.removeEventListener('mousemove', handleMoveMove);
  document.removeEventListener('mouseup', endMove);
  document.removeEventListener('touchmove', handleMoveMove);
  document.removeEventListener('touchend', endMove);
};

const confirmCrop = async () => {
  if (!image) return;

  // Crear canvas con la imagen recortada
  const cropCanvas = document.createElement('canvas');
  const ctx = cropCanvas.getContext('2d');
  if (!ctx) return;

  const cropSize = cropArea.value.size;
  cropCanvas.width = cropSize;
  cropCanvas.height = cropSize;

  // Dibujar la imagen recortada
  ctx.drawImage(
    image,
    cropArea.value.x,
    cropArea.value.y,
    cropSize,
    cropSize,
    0,
    0,
    cropSize,
    cropSize
  );

  // Convertir a Blob
  cropCanvas.toBlob((blob) => {
    if (blob) {
      emit('confirm', blob);
    }
  }, 'image/jpeg', 0.9);
};
</script>

<style scoped>
.cropper-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.cropper-modal {
  background: white;
  border-radius: 12px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.cropper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.cropper-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.cropper-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.cropper-close:hover {
  background: #f3f4f6;
  color: var(--color-text-main);
}

.cropper-close svg {
  width: 24px;
  height: 24px;
}

.cropper-container {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  overflow: auto;
  flex: 1;
  min-height: 0;
}

.cropper-canvas-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
  min-width: 300px;
  min-height: 300px;
}

.cropper-canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.cropper-overlay-area {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cropper-dark-area {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.cropper-dark-top,
.cropper-dark-bottom {
  left: 0;
  width: 100%;
}

.cropper-crop-area {
  position: absolute;
  border: 2px solid var(--color-brand-main);
  pointer-events: auto;
  cursor: move;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

.cropper-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cropper-grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
}

.cropper-grid-horizontal {
  width: 100%;
  height: 1px;
  left: 0;
}

.cropper-grid-horizontal:first-of-type {
  top: 33.333%;
}

.cropper-grid-horizontal:last-of-type {
  top: 66.666%;
}

.cropper-grid-vertical {
  width: 1px;
  height: 100%;
  top: 0;
}

.cropper-grid-vertical:first-of-type {
  left: 33.333%;
}

.cropper-grid-vertical:last-of-type {
  left: 66.666%;
}

.cropper-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--color-brand-main);
  border: 2px solid white;
  border-radius: 50%;
  cursor: se-resize;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  z-index: 10;
}

.cropper-handle-nw {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

.cropper-handle-ne {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.cropper-handle-sw {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.cropper-handle-se {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}

.cropper-move-handle {
  position: absolute;
  inset: 0;
  cursor: move;
}

.cropper-controls {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.cropper-control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cropper-control-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.cropper-control-group p {
  margin: 0;
  padding: 0.5rem 0;
  line-height: 1.4;
}

.cropper-size-display {
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  color: var(--color-text-main);
  font-size: 0.875rem;
}

.cropper-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.cropper-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-brand-main);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cropper-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-brand-main);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cropper-zoom-label {
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
}

.cropper-rotation-buttons {
  display: flex;
  gap: 0.5rem;
}

.cropper-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .cropper-container {
    flex-direction: column;
  }

  .cropper-controls {
    width: 100%;
    padding: 0;
  }

  .cropper-modal {
    max-width: 100%;
  }
}
</style>
