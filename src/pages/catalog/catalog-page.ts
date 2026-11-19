import type { AppLocation, PageView } from "../../types/routes";
import { createElement } from './../../utils/dom';
import type { Product } from "../../types/product";
 
export interface CatalogPageOptions {
  readonly onProductOpen?: (product: Product) => void;
  readonly onNavigate: (query: URLSearchParams, isReplace: boolean) => void;
}

export function renderCatalogPage (title: string, location: AppLocation, options?: CatalogPageOptions): PageView {
    let address: URLSearchParams = location.query;
    
    return {
        elements: [ createElement('h1', {
            text: title || 'Catalog'
        })]
    }
}