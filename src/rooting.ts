/**
 * RootingFast: The backbone of QueryFast ecosystem.
 */

interface RouteContext {
  params: Record<string, string>;
  path: string;
}

type PageFunction = (ctx: RouteContext, scp: any) => Promise<any> | any;

export class RootingFast {
  private static routes: Record<string, PageFunction> = {};
  private static scp: any = {};
  private static currentCleanup: (() => void) | null = null;

  static route(routes: Record<string, PageFunction>) {
    this.routes = routes;
    console.log("RootingFast: Routes initialized", routes);
    
    window.addEventListener('popstate', () => this.navigate());
    document.addEventListener('click', (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const url = link.getAttribute('href')!;
        history.pushState(null, '', url);
        this.navigate();
      }
    });
    this.navigate();
  }

  private static async navigate() {
    if (this.currentCleanup) {
      this.currentCleanup();
      this.currentCleanup = null;
    }

    const path = window.location.pathname;
    console.log("RootingFast: Navigating to", path);

    const { page, params } = this.match(path);

    if (page) {
      console.log("RootingFast: Matched page", page.name, "with params", params);
      const ctx: RouteContext = { params, path };
      const result = await page(ctx, this.scp);
      if (typeof result === 'function') {
        this.currentCleanup = result;
      }
    } else {
      console.warn("RootingFast: No route matched for", path);
    }
  }

  private static match(path: string) {
    for (const routePath in this.routes) {
      // Make matching flexible for subdirectories/file systems
      const pattern = routePath === '/' ? '(?:/|index.html)?$' : routePath.replace(/:[^\s/]+/g, '([^/]+)') + '$';
      const regex = new RegExp(pattern);
      const match = path.match(regex);
      if (match) {
        const params: Record<string, string> = {};
        const paramNames = (routePath.match(/:[^\s/]+/g) || []).map(n => n.slice(1));
        paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
        return { page: this.routes[routePath], params };
      }
    }
    return { page: null, params: {} };
  }

  static go(path: string) {
    history.pushState(null, '', path);
    this.navigate();
  }
}

if (typeof window !== 'undefined') {
  (window as any).RootingFast = RootingFast;
}
