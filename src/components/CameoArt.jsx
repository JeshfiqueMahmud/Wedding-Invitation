import React from 'react';

// Illustrated portrait of the couple inside a gold oval (original artwork, kept intact).
export default function CameoArt({ className = '' }) {
  return (
  <svg
    viewBox="0 0 460 540"
    className={`overflow-visible ${className}`}
    role="img"
    aria-label="Ornate gold floral oval frame featuring illustrated avatars of Groom Jeshfique Mahmud and Bride Faheema Shaheed Tamanna"
  >
    <defs>
      {/* Baroque Metallic Gold Gradients */}
      <linearGradient id="baroqueGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF5D6" />
        <stop offset="28%" stopColor="#E5C675" />
        <stop offset="55%" stopColor="#B88924" />
        <stop offset="82%" stopColor="#F3DC99" />
        <stop offset="100%" stopColor="#8C6414" />
      </linearGradient>

      <linearGradient id="darkGoldStroke" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7A5410" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#FFF1C2" />
      </linearGradient>

      {/* Midnight Navy Rose Gradient */}
      <radialGradient id="navyRoseGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#1D3E78" />
        <stop offset="55%" stopColor="#0B1E40" />
        <stop offset="100%" stopColor="#040B1A" />
      </radialGradient>

      {/* Cream Ivory Rose Gradient */}
      <radialGradient id="ivoryRoseGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFDF7" />
        <stop offset="65%" stopColor="#EFE0BE" />
        <stop offset="100%" stopColor="#C8AD76" />
      </radialGradient>

      {/* Warm Cameo Backdrop */}
      <radialGradient id="cameoBg" cx="50%" cy="38%" r="62%">
        <stop offset="0%" stopColor="#F3E5DC" />
        <stop offset="70%" stopColor="#DFC8BC" />
        <stop offset="100%" stopColor="#B99C8E" />
      </radialGradient>

      {/* Groom Ivory & Gold Sherwani Gradient */}
      <linearGradient id="groomSherwani" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBF7EA" />
        <stop offset="100%" stopColor="#E6D9B5" />
      </linearGradient>

      {/* Bride Champagne-Ivory Saree Gradient */}
      <linearGradient id="brideSaree" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCF9F2" />
        <stop offset="100%" stopColor="#E4D4B7" />
      </linearGradient>

      {/* Skin Tones */}
      <linearGradient id="skinGroom" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DFAA88" />
        <stop offset="100%" stopColor="#C58B68" />
      </linearGradient>
      <linearGradient id="skinBride" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#EBC0A3" />
        <stop offset="100%" stopColor="#D49F7E" />
      </linearGradient>

      {/* Gold Zari Embroidery Pattern */}
      <pattern id="royalZari" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r="1.2" fill="#C59B27" opacity="0.55" />
        <path
          d="M8 2 L9.5 6.5 L14 8 L9.5 9.5 L8 14 L6.5 9.5 L2 8 L6.5 6.5 Z"
          fill="none"
          stroke="#B88924"
          strokeWidth="0.5"
          opacity="0.45"
        />
      </pattern>

      {/* Oval Clip Path */}
      <clipPath id="ovalPortraitClip">
        <ellipse cx="230" cy="268" rx="132" ry="184" />
      </clipPath>
    </defs>

    {/* Outer Golden Foliage & Leaves Behind Frame */}
    <g className="floral-float" opacity="0.92">
      <path d="M325 110 C360 75, 395 50, 418 35 C395 65, 375 95, 345 125 Z" fill="url(#baroqueGold)" />
      <path d="M342 135 C382 112, 418 98, 442 90 C412 115, 385 135, 355 152 Z" fill="url(#baroqueGold)" opacity="0.85" />
      <path d="M310 88 C332 52, 352 28, 368 15 C355 45, 340 72, 322 98 Z" fill="url(#baroqueGold)" opacity="0.8" />
      <path d="M125 420 C88 445, 52 465, 25 478 C58 452, 85 430, 112 405 Z" fill="url(#baroqueGold)" />
      <path d="M105 385 C65 398, 35 408, 14 414 C45 395, 75 382, 102 372 Z" fill="url(#baroqueGold)" opacity="0.85" />
      <path d="M335 420 C372 445, 408 465, 435 478 C402 452, 375 430, 348 405 Z" fill="url(#baroqueGold)" />
    </g>

    {/* Cameo Interior Portrait Backdrop */}
    <g clipPath="url(#ovalPortraitClip)">
      <ellipse cx="230" cy="268" rx="134" ry="186" fill="url(#cameoBg)" />
      <g stroke="#B89B8D" strokeWidth="0.7" opacity="0.32">
        <line x1="90" y1="120" x2="370" y2="120" />
        <line x1="90" y1="142" x2="370" y2="142" />
        <line x1="90" y1="164" x2="370" y2="164" />
        <line x1="90" y1="186" x2="370" y2="186" />
        <line x1="90" y1="208" x2="370" y2="208" />
        <line x1="90" y1="230" x2="370" y2="230" />
        <line x1="90" y1="252" x2="370" y2="252" />
        <line x1="90" y1="274" x2="370" y2="274" />
      </g>

      {/* ===================================================== */}
      {/* GROOM AVATAR: JESHFIQUE MAHMUD (Left, Ivory Sherwani) */}
      {/* ===================================================== */}
      <g className="avatar-breathe">
        <path
          d="M98 465 C100 375, 118 318, 156 304 L224 304 C252 318, 264 375, 266 465 Z"
          fill="url(#groomSherwani)"
          stroke="#C59B27"
          strokeWidth="1.6"
        />
        <path
          d="M104 465 C106 380, 122 322, 158 308 L222 308 C248 322, 258 380, 260 465 Z"
          fill="url(#royalZari)"
        />

        <path d="M188 306 L201 306 L205 465 L185 465 Z" fill="#F8F4E8" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="195" cy="336" r="3.2" fill="url(#baroqueGold)" />
        <circle cx="195" cy="364" r="3.2" fill="url(#baroqueGold)" />
        <circle cx="195" cy="392" r="3.2" fill="url(#baroqueGold)" />
        <circle cx="195" cy="420" r="3.2" fill="url(#baroqueGold)" />

        <path
          d="M162 298 C175 312, 207 312, 220 298 L215 286 C203 295, 179 295, 167 286 Z"
          fill="#EFE3C4"
          stroke="#B88924"
          strokeWidth="1.4"
        />

        <path d="M172 262 L208 262 L211 296 C199 305, 181 305, 169 296 Z" fill="url(#skinGroom)" />

        <g className="avatar-sway">
          <ellipse cx="152" cy="228" rx="5.5" ry="9.5" fill="#CF9674" />
          <path
            d="M155 204 C155 176, 226 176, 226 204 C226 240, 212 270, 190 272 C168 270, 155 240, 155 204 Z"
            fill="url(#skinGroom)"
          />
          <ellipse cx="169" cy="238" rx="8" ry="4.5" fill="#D9776C" opacity="0.22" />
          <ellipse cx="212" cy="238" rx="8" ry="4.5" fill="#D9776C" opacity="0.22" />

          <path d="M164 212 Q174 207 183 211" fill="none" stroke="#1B1715" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M197 211 Q206 207 216 212" fill="none" stroke="#1B1715" strokeWidth="2.6" strokeLinecap="round" />

          <g className="avatar-eye">
            <ellipse cx="174" cy="222" rx="4.8" ry="3.6" fill="#FFFFFF" />
            <circle cx="175" cy="222" r="2.6" fill="#1E1512" />
            <circle cx="176" cy="221" r="0.9" fill="#FFFFFF" />

            <ellipse cx="206" cy="222" rx="4.8" ry="3.6" fill="#FFFFFF" />
            <circle cx="205" cy="222" r="2.6" fill="#1E1512" />
            <circle cx="206" cy="221" r="0.9" fill="#FFFFFF" />
          </g>

          <path d="M190 221 L188 235 Q191 238 195 235" fill="none" stroke="#B37554" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M176 245 Q190 259 204 245 Z" fill="#FFFFFF" stroke="#9A5346" strokeWidth="1.3" strokeLinejoin="round" />

          <path
            d="M151 214 C147 186, 162 162, 190 162 C218 162, 233 186, 229 214 C227 201, 221 195, 215 199 C208 192, 200 201, 192 196 C184 202, 175 193, 167 199 C159 195, 154 202, 151 214 Z"
            fill="#161312"
          />
          <path
            d="M164 178 Q173 171 182 178 M188 175 Q197 168 206 176 M170 188 Q179 181 188 188 M194 187 Q203 180 212 188"
            fill="none"
            stroke="#302927"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* ===================================================== */}
      {/* BRIDE AVATAR: FAHEEMA SHAHEED TAMANNA (Right, Ivory) */}
      {/* ===================================================== */}
      <g className="avatar-breathe-delay">
        <path d="M235 215 C225 262, 222 330, 230 390 L345 390 C354 330, 350 262, 340 215 Z" fill="#151211" />

        <path
          d="M224 465 C226 385, 240 326, 268 314 L322 314 C350 326, 364 385, 368 465 Z"
          fill="url(#brideSaree)"
          stroke="#C59B27"
          strokeWidth="1.6"
        />
        <path
          d="M230 465 C232 390, 245 330, 270 318 L320 318 C345 330, 358 390, 362 465 Z"
          fill="url(#royalZari)"
        />
        <path d="M242 324 L344 432 L316 465 L228 362 Z" fill="url(#baroqueGold)" opacity="0.28" />
        <line x1="242" y1="324" x2="344" y2="432" stroke="#B88924" strokeWidth="2" />

        <path d="M276 268 L304 268 L307 314 C295 322, 285 322, 273 314 Z" fill="url(#skinBride)" />

        <path d="M272 292 Q290 304 308 292" fill="none" stroke="url(#baroqueGold)" strokeWidth="4" strokeLinecap="round" />
        <g fill="#FFFDF7">
          <circle cx="277" cy="296" r="2" />
          <circle cx="283" cy="299" r="2.2" />
          <circle cx="290" cy="300" r="2.5" />
          <circle cx="297" cy="299" r="2.2" />
          <circle cx="303" cy="296" r="2" />
        </g>

        <g className="avatar-sway">
          <circle cx="324" cy="242" r="3" fill="url(#baroqueGold)" />
          <path d="M320 250 L328 250 L326 244 L322 244 Z" fill="url(#baroqueGold)" />
          <circle cx="321" cy="252" r="1.2" fill="#FFFDF7" />
          <circle cx="324" cy="253" r="1.2" fill="#FFFDF7" />
          <circle cx="327" cy="252" r="1.2" fill="#FFFDF7" />

          <path
            d="M255 212 C255 186, 320 186, 320 212 C320 246, 306 272, 287 274 C268 272, 255 246, 255 212 Z"
            fill="url(#skinBride)"
          />

          <ellipse cx="268" cy="242" rx="7.5" ry="4" fill="#E07A7A" opacity="0.28" />
          <ellipse cx="306" cy="242" rx="7.5" ry="4" fill="#E07A7A" opacity="0.28" />

          <path d="M263 218 Q272 213 280 217" fill="none" stroke="#1B1715" strokeWidth="2" strokeLinecap="round" />
          <path d="M294 217 Q302 213 311 218" fill="none" stroke="#1B1715" strokeWidth="2" strokeLinecap="round" />

          <g className="avatar-eye">
            <ellipse cx="272" cy="227" rx="4.6" ry="3.4" fill="#FFFFFF" />
            <circle cx="271.5" cy="227" r="2.5" fill="#1E1512" />
            <circle cx="272.5" cy="226" r="0.9" fill="#FFFFFF" />
            <path d="M266 226 Q272 222 278 226" fill="none" stroke="#151211" strokeWidth="1.4" strokeLinecap="round" />

            <ellipse cx="302" cy="227" rx="4.6" ry="3.4" fill="#FFFFFF" />
            <circle cx="301.5" cy="227" r="2.5" fill="#1E1512" />
            <circle cx="302.5" cy="226" r="0.9" fill="#FFFFFF" />
            <path d="M296 226 Q302 222 308 226" fill="none" stroke="#151211" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          <path d="M287 226 L285 239 Q287 241 289 239" fill="none" stroke="#BE8366" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M277 250 Q287 257 297 250" fill="none" stroke="#B35454" strokeWidth="2.2" strokeLinecap="round" />

          <path
            d="M287 176 C258 176, 242 204, 241 252 C240 286, 232 316, 224 338 C239 325, 248 298, 252 258 C254 225, 263 203, 287 194 C311 203, 320 225, 322 258 C326 298, 335 325, 350 338 C342 316, 334 286, 333 252 C332 204, 316 176, 287 176 Z"
            fill="#151211"
          />
        </g>
      </g>
    </g>

    {/* Oval Beveled Gold Ring */}
    <ellipse cx="230" cy="268" rx="142" ry="194" fill="none" stroke="url(#baroqueGold)" strokeWidth="13" />
    <ellipse cx="230" cy="268" rx="148" ry="200" fill="none" stroke="url(#darkGoldStroke)" strokeWidth="2.2" />
    <ellipse cx="230" cy="268" rx="134" ry="186" fill="none" stroke="#7A5410" strokeWidth="2" />
    <ellipse cx="230" cy="268" rx="138" ry="190" fill="none" stroke="#FFF4D2" strokeWidth="2.4" strokeDasharray="2 7" strokeLinecap="round" />

    {/* Top Baroque Crown Crest */}
    <g transform="translate(230, 68)">
      <path
        d="M-38 8 C-26 -14, -10 -18, 0 -28 C10 -18, 26 -14, 38 8 C22 2, 10 4, 0 12 C-10 4, -22 2, -38 8 Z"
        fill="url(#baroqueGold)"
        stroke="#7A5410"
        strokeWidth="1.2"
      />
      <circle cx="0" cy="-10" r="5" fill="#FFF7DF" stroke="#B88924" strokeWidth="1.2" />
      <circle cx="-18" cy="-2" r="3" fill="#FFF7DF" />
      <circle cx="18" cy="-2" r="3" fill="#FFF7DF" />
    </g>

    {/* Bottom Baroque Scroll Crest */}
    <g transform="translate(230, 468)">
      <path
        d="M-42 -6 C-25 14, -10 16, 0 24 C10 16, 25 14, 42 -6 C24 0, 10 -2, 0 -10 C-10 -2, -24 0, -42 -6 Z"
        fill="url(#baroqueGold)"
        stroke="#7A5410"
        strokeWidth="1.2"
      />
      <circle cx="0" cy="8" r="4.5" fill="#FFF7DF" stroke="#B88924" strokeWidth="1.2" />
    </g>

    {/* Left Floral Cluster */}
    <g transform="translate(92, 268)">
      <circle cx="0" cy="0" r="26" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1" />
      <path d="M-12 -6 C-6 -18, 12 -16, 14 -4 C16 10, -4 16, -12 6 C-18 -2, -6 -12, 4 -6" fill="none" stroke="#3B68B5" strokeWidth="1.4" opacity="0.7" />
      <path d="M-6 -2 C-2 -8, 6 -7, 7 -1 C8 5, -2 8, -6 2" fill="none" stroke="#D4AF37" strokeWidth="0.9" opacity="0.65" />
    </g>
    <g transform="translate(105, 345)">
      <circle cx="0" cy="0" r="24" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1" />
      <path d="M-10 -5 C-5 -15, 10 -14, 12 -3 C14 8, -3 14, -10 5" fill="none" stroke="#3B68B5" strokeWidth="1.3" opacity="0.7" />
    </g>
    <g transform="translate(135, 422)">
      <circle cx="0" cy="0" r="22" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="1.2" />
      <path d="M-9 -4 C-4 -13, 9 -12, 11 -2 C12 7, -3 12, -9 4 C-14 -1, -4 -9, 3 -4" fill="none" stroke="#B88924" strokeWidth="1.2" />
    </g>

    {/* Right Floral Cluster */}
    <g transform="translate(362, 185)">
      <circle cx="0" cy="0" r="19" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="1.1" />
      <path d="M-8 -3 C-3 -11, 8 -10, 9 -2 C10 6, -2 10, -8 3" fill="none" stroke="#B88924" strokeWidth="1.1" />
    </g>
    <g transform="translate(372, 265)">
      <circle cx="0" cy="0" r="25" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1" />
      <path d="M-11 -5 C-5 -16, 11 -15, 13 -3 C15 9, -3 15, -11 5" fill="none" stroke="#3B68B5" strokeWidth="1.4" opacity="0.7" />
      <path d="M-5 -2 C-2 -7, 5 -6, 6 -1 C7 4, -2 7, -5 2" fill="none" stroke="#D4AF37" strokeWidth="0.9" opacity="0.65" />
    </g>
    <g transform="translate(355, 355)">
      <circle cx="0" cy="0" r="27" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1" />
      <path d="M-12 -6 C-6 -18, 12 -16, 14 -4 C16 10, -4 16, -12 6" fill="none" stroke="#3B68B5" strokeWidth="1.4" opacity="0.7" />
    </g>
    <circle cx="115" cy="195" r="7" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="0.9" />
    <circle cx="332" cy="422" r="8" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="0.9" />
    <circle cx="170" cy="84" r="2.2" fill="#FFF7DF" className="gold-sparkle" />
    <circle cx="348" cy="138" r="2.5" fill="#FFF7DF" className="gold-sparkle" style={{ animationDelay: '0.8s' }} />
    <circle cx="95" cy="395" r="2.2" fill="#FFF7DF" className="gold-sparkle" style={{ animationDelay: '1.5s' }} />
  </svg>
  );
}
