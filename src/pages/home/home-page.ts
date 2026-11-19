import type { PageView } from "../../types/routes";
import { createElement } from './../../utils/dom';
 

export function renderHomePage (options?: {title?: string}): PageView {
    return {
        elements: [ createElement('h1', {
            text: options?.title || 'Home Page'
        })]
    }
}