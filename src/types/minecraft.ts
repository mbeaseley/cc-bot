/**=============================
  Minecraft Url Objects
===============================*/

export class McUrl {
  domain: string;
  port: number | undefined;

  constructor(domain?: string, port?: number | undefined) {
    this.domain = domain || '';
    this.port = port ? port : undefined;
  }
}
