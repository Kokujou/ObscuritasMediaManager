import { html } from 'lit-element';
import { IngredientModel } from '../../obscuritas-media-manager-backend-client';

export function renderAsianShopLinks(ingredient: IngredientModel) {
    return html`
        <div class="shop-icons">
            <link-element
                target="_blank"
                href="https://dawayo.de/de/?s=${ingredient.ingredientName}&post_type=product"
                tooltip="Dawayo"
            >
                <img class="shop-icon" src="https://dawayo.de/wp-content/uploads/2021/11/Dawayo-Favicon-500x500px-300x300.png" />
            </link-element>
            <link-element target="_blank" href="https://www.nanuko.de/search?q=${ingredient.ingredientName}" tooltip="Nanuko">
                <img
                    class="shop-icon"
                    src="https://www.nanuko.de/storage/images/Logo-2.png?hash=acc3189b1ad2ef04e0a8164bf9d139b4cd04fd10&height=400&width=2560&shop=79558993"
                />
            </link-element>
            <link-element
                target="_blank"
                href="https://japanfoodexpress-shochiku.de/search?search=${ingredient.ingredientName}"
                tooltip="Shochiku"
            >
                <img
                    class="shop-icon"
                    src="https://japanfoodexpress-shochiku.de/media/25/5d/38/1684137839/Shochiku_Logo_grey_RGB_1280px_300x.png"
                />
            </link-element>
            <link-element
                target="_blank"
                href="https://www.dae-yang.online/search?type=product&options%5Bprefix%5D=last&q=${ingredient.ingredientName}"
                tooltip="Dae-Yang"
            >
                <img class="shop-icon" src="https://www.dae-yang.online/cdn/shop/files/Karaage_logo_1.png?v=1706116461" />
            </link-element>
        </div>
    `;
}
