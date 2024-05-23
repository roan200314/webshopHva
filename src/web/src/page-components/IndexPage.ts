import { customElement } from "lit/decorators.js";
import { html, LitElement, TemplateResult } from "lit";

@customElement("index-page")
export class IndexPage extends LitElement {
    public connectedCallback(): void {
        super.connectedCallback();
    }

    public render(): TemplateResult {
        return html` <h1>Welcome to the Index Page</h1> `;
    }
}
