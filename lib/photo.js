// BloodBond Frontend - photo helper
// Profile photo / team member photo pathanor age chobi-ta choto kore nao:
// lomba dik-ta beshi hole 512px, JPEG quality 0.85. Ete base64 text-ta
// choto thake (sadharonoto 30-100KB), database-e jomate ar pathate subidha.
// Kono notun package lage na - browser-er canvas diyei kora hoy.

// Server-e base64 photo-r sorboccho lomba (500KB). Er beshi hole
// backend "chobi beshi boro" bole firiye dibe.
export const MAX_PHOTO_LENGTH = 500000;

// Ekta image file (input theke) -> choto kora JPEG data URI.
// Data URI mane: "data:image/jpeg;base64,...." - sorasori DB-e jomano jay.
export function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('Chobi-r file dao (JPG / PNG).'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        // Lomba dik-ta 512px-er beshi hole choto koro, ratio thik rekhe.
        const MAX_SIDE = 512;
        const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        // JPEG-e transparency thake na - sada background diye nao,
        // jeno PNG chobi-r faka jayga kalo na hoye jay.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(new Error('Chobi choto kora gelo na. Abar try koro.'));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Chobi-ta khola gelo na. Onno chobi dao.'));
    };
    img.src = url;
  });
}

// Chobi-ta server-e pathanor moto kina dekho: data URI + lomba thik ache kina.
export function photoOk(photo) {
  return (
    typeof photo === 'string' &&
    photo.startsWith('data:image/') &&
    photo.length <= MAX_PHOTO_LENGTH
  );
}
