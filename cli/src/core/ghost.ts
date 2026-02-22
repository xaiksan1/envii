import chalk from 'chalk';

/**
 * GHOST STEGO MODULE (TypeScript Port)
 * Porté depuis: python/helpers/ghost_stego.py
 *
 * Utilise les caractères à largeur nulle pour cacher des données binaires
 * dans du texte visible.
 */
export class GhostStego {
  private readonly ZWS = '\u200B';   // Bit 0
  private readonly ZWNJ = '\u200C';  // Bit 1
  private readonly ZWJ = '\u200D';   // End Marker

  // Messages de couverture par défaut (innocents)
  private readonly DEFAULT_COVERS = [
    "System log entry: routine check completed successfully.",
    "Configuration file loaded. No errors detected.",
    "The weather in the cloud is always partly cloudy.",
    "Checking dependencies... Done.",
    "Service status: OPTIMAL. Latency: 24ms.",
    "Initiating handshake protocol v2.1.",
    "Memory integrity verified. Heap size stable.",
    "User authentication token refreshed.",
  ];

  /**
   * Encode une chaîne (ou un buffer converti en chaîne hex/base64) dans un texte de couverture.
   */
  public encode(secret: string, coverText?: string): string {
    const cover = coverText || this.getRandomCover();
    
    // Conversion en binaire
    let binarySecret = '';
    for (let i = 0; i < secret.length; i++) {
      const charCode = secret.charCodeAt(i);
      binarySecret += charCode.toString(2).padStart(8, '0');
    }

    // Mapping vers caractères invisibles
    let stegoStream = '';
    for (const bit of binarySecret) {
      stegoStream += bit === '0' ? this.ZWS : this.ZWNJ;
    }
    stegoStream += this.ZWJ; // Fin de message

    // Injection au milieu
    const midpoint = Math.floor(cover.length / 2);
    return cover.slice(0, midpoint) + stegoStream + cover.slice(midpoint);
  }

  /**
   * Décode un texte contenant des données cachées.
   */
  public decode(stegoText: string): string | null {
    let binaryResult = '';
    
    for (const char of stegoText) {
      if (char === this.ZWS) binaryResult += '0';
      else if (char === this.ZWNJ) binaryResult += '1';
      else if (char === this.ZWJ) break; // Fin détectée
    }

    if (!binaryResult) return null;

    try {
      let result = '';
      for (let i = 0; i < binaryResult.length; i += 8) {
        const byte = binaryResult.slice(i, i + 8);
        result += String.fromCharCode(parseInt(byte, 2));
      }
      return result;
    } catch (e) {
      console.error(chalk.red("Ghost signal corrupted."));
      return null;
    }
  }

  /**
   * Vérifie si un texte contient un signal fantôme.
   * Optimisé avec Regex pour la rapidité.
   */
  public hasGhostSignal(text: string): boolean {
    return /[\u200B\u200C]/.test(text);
  }

  /**
   * Nettoie le texte (retire le signal fantôme).
   */
  public sanitize(text: string): string {
    // eslint-disable-next-line no-control-regex
    return text.replace(new RegExp(`[${this.ZWS}${this.ZWNJ}${this.ZWJ}]`, 'g'), '');
  }

  private getRandomCover(): string {
    return this.DEFAULT_COVERS[Math.floor(Math.random() * this.DEFAULT_COVERS.length)];
  }
}

export const ghost = new GhostStego();
