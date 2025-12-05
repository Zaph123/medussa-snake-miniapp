declare module 'sha.js/sha256' {
  class SHA256 {
    constructor();
    update(data: string | Buffer | Uint8Array, encoding?: string): SHA256;
    digest(encoding: 'hex'): string;
    digest(encoding?: string): Buffer;
  }
  export = SHA256;
}

