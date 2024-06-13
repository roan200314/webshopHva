import { customElement, state } from "lit/decorators.js";
import { html, LitElement, TemplateResult, css } from "lit";
import { OrderItem } from "@shared/types/OrderItem";
import { OrderItemService } from "../services/OrderItemService";
import { CartItem } from "@shared/types";
import { UserHelloResponse } from "@shared/responses/UserHelloResponse";
import { AuthorizationLevel } from "../models/interfaces/AuthorizationLevel";
import { UserService } from "../services/UserService";

@customElement("index-page")
export class IndexPage extends LitElement {
    public static styles = css`
        .product-section {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }

        .product {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .product img {
            height: 200px;
            width: 100%;
            object-fit: cover;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .product h3 {
            margin-bottom: 10px;
            text-align: center;
        }

        .product p {
            margin-bottom: 10px;
            text-align: center;
        }

        .buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .add-to-cart-button {
            padding: 8px 16px;
            background-color: #ffaa00;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .add-to-cart-button:hover {
            background-color: #b17704;
        }

        .base-price {
            font-weight: bold;
            color: #333;
        }

        .wrapper {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
        }

        .title {
            text-align: center;
            margin-bottom: 20px;
        }

        .featured-span {
            text-align: center;
            margin-bottom: 20px;
        }

        .additional-content {
            margin-top: 40px;
            text-align: center;
        }

        .additional-content h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        .additional-content p {
            text-align: center;
            line-height: 1.6;
            inline-size: 50%;
            font-size: 1.1em;
        }

        .welcome {
            text-align: center;
            line-height: 1.6;
            inline-size: 50%;
            font-size: 1.4em;
        }

        .welcome-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 40px;
            text-align: center;
        }

        .featured-span {
            display: flex;
            justify-content: center;
            text-align: center;
        }

        footer {
            background-color: #333;
            color: white;
            padding: 20px 0;
            margin-top: 40px;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            width: 80%;
            margin: auto;
        }

        .footer-column {
            width: 30%;
        }

        .footer-column h3 {
            border-bottom: 1px solid #f0c040;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        .footer-link {
            color: white;
            text-decoration: none;
            display: block;
            margin: 5px 0;
        }

        .footer-link:hover {
            text-decoration: underline;
        }

        .banner,
        .banner-bottom {
            text-align: center;
            padding: 20px;
            background-color: #f0f0f0;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
            font-size: 1.2em;
            font-weight: bold;
            color: #444;
            background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .banner-bottom {
            border-top: 1px solid #ddd;
            margin-top: 20px;
            border-bottom: none;
        }

        .additional-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 40px;
            text-align: center;
        }

        .about-us {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 40px;
            text-align: center;
        }

        .about-us p {
            text-align: center;
            line-height: 1.6;
            inline-size: 50%;
            font-size: 1.1em;
        }
    `;

    private _orderItemService: OrderItemService = new OrderItemService();
    private _userService: UserService = new UserService();

    @state()
    private loggedIn: boolean = false;
    @state()
    private employeeOrHigher: boolean = false;

    @state()
    private orderItems: OrderItem[] = [];

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();

        await this.getUserInformation();
        await this.getFeaturedItems();
    }

    public render(): TemplateResult {
        return html`
            <div class="content-wrapper">
                <!-- Top banner section -->
                <div class="banner">
                    <p>Free shipping on orders over $50! Limited time offer.</p>
                </div>

                <!-- Welcome section -->
                <div class="welcome-section">
                    <h1 class="title">Welcome to Our Store</h1>
                    <p class="welcome">
                        Welcome to our store! Dive into the world of gaming with our wide range of video games
                        and exclusive merchandise. Whether you're a hardcore gamer or a casual player, we have
                        something for everyone. Discover the latest titles, explore unique game-themed
                        apparel, and collect one-of-a-kind items from your favorite games. Take your time to
                        browse through our featured items and discover amazing deals. Don't forget to check
                        out our special promotions and discounts!
                    </p>
                </div>

                <!-- Featured items section -->
                <div class="featured-items">
                    <h2 class="title">Featured Items</h2>
                    <span class="featured-span">Explore our selection of featured games and merchandise</span>
                    ${this.orderItems.length > 0
                        ? html`
                              <div class="wrapper">
                                  <section class="product-section" id="product-section">
                                      ${this.orderItems.map((orderItem: OrderItem) =>
                                          this.renderOrderItem(orderItem),
                                      )}
                                  </section>
                              </div>
                          `
                        : html`<p>Loading items...</p>`}
                </div>

                <!-- Additional content -->
                <div class="additional-content">
                    <h2>Discover More</h2>
                    <p>
                        Browse our categories to find the perfect products for your gaming passion. From the
                        latest pc game releases to must-have gaming accessories and stylish game-themed
                        clothing, we have it all. Don't forget to check out our special promotions and
                        discounts!
                    </p>
                    <p>
                        Our goal is to provide a seamless and enjoyable shopping experience with a diverse
                        selection of high-quality products. Thank you for choosing us as your go-to
                        destination for all things gaming!
                    </p>
                </div>

                <!-- About Us section -->
                <div class="about-us">
                    <h2>About Us</h2>
                    <p>
                        We are a passionate team of gamers dedicated to bringing you the best in video games
                        and game-related merchandise. Founded by gaming enthusiasts, our store is committed to
                        providing top-notch products, exceptional customer service, and a community-driven
                        shopping experience. Our mission is to connect gamers with the items they love and
                        help you immerse yourself in the worlds of your favorite games. Thank you for being a
                        part of our gaming community!
                    </p>
                </div>

                <!-- Bottom banner section -->
                <div class="banner-bottom">
                    <p>
                        Join our loyalty program and earn points with every purchase! Unlock exclusive rewards
                        and discounts.
                    </p>
                </div>

                <!-- Footer section -->
                <footer>
                    <div class="footer-content">
                        <div class="footer-column">
                            <h3>Customer Service</h3>
                            <ul>
                                <li><a href="#" class="footer-link">Returns</a></li>
                                <li><a href="#" class="footer-link">Payments</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h3>Shop</h3>
                            <ul>
                                <li><a href="#" class="footer-link">Games</a></li>
                                <li><a href="#" class="footer-link">Merchandise</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h3>Privacy</h3>
                            <ul>
                                <li><a href="#" class="footer-link">Privacy Policy</a></li>
                                <li><a href="#" class="footer-link">Terms & Conditions</a></li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    }

    public async getFeaturedItems(): Promise<void> {
        const result: OrderItem[] | undefined = await this._orderItemService.getFeaturedItems();
        if (result) {
            this.orderItems = result;
        } else {
            console.error("Failed to fetch order items");
        }
    }

    private renderOrderItem(orderItem: OrderItem): TemplateResult {
        const imageURL: string =
            orderItem.imageURLs && orderItem.imageURLs.length > 0 ? orderItem.imageURLs[0] : "";

        const buttonLabel: string = orderItem.featured ? "Remove from Featured" : "Add to Featured";
        const newFeaturedState: boolean = !orderItem.featured;
        orderItem.description = orderItem.description ? this.getFirstSentence(orderItem.description) : "";
        return html`
            <div class="product">
                <h3><a href="orderitem.html?id=${orderItem.id}">${orderItem.name}</a></h3>
                <img src="${imageURL}" alt="${orderItem.name}" id="order-item-image" />
                <p>${orderItem.description}</p>
                <div class="buttons">
                    <span class="base-price">€ ${orderItem.price}</span>
                    <button
                        class="add-to-cart-button"
                        @click=${async (): Promise<void> => await this.addToCart(orderItem)}
                    >
                        In cart
                    </button>
                    ${this.employeeOrHigher
                        ? html` <button
                              class="addFeature"
                              @click=${async (): Promise<void> =>
                                  await this.setOrderItemAsFeatured(orderItem.id, newFeaturedState)}
                          >
                              ${buttonLabel}
                          </button>`
                        : ""}
                </div>
            </div>
        `;
    }

    public getFirstSentence(text: string): string {
        const sentenceEndings: string[] = [".", "!", "?"];
        let endOfFirstSentence: number = -1;

        for (const ending of sentenceEndings) {
            const index: any = text.indexOf(ending);
            if (index !== -1 && (endOfFirstSentence === -1 || index < endOfFirstSentence)) {
                endOfFirstSentence = index;
            }
        }

        if (endOfFirstSentence !== -1) {
            return text.substring(0, endOfFirstSentence + 1).trim();
        }

        const words: any = text.split(/\s+/);
        const firstTwentyWords: string = words.slice(0, 20).join(" ");
        return firstTwentyWords.trim();
    }

    private async addToCart(orderItem: OrderItem): Promise<void> {
        let cartItems: CartItem[] = [];

        if (this.loggedIn) {
            const result: CartItem[] | undefined = await this._userService.addOrderItemToCart(orderItem.id);

            if (result) {
                cartItems = result;
            }
        } else {
            try {
                cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
            } catch (error) {
                console.error("Error parsing cart items from localStorage", error);
            }

            const cartItem: CartItem | undefined = cartItems.find(
                (ci: CartItem) => ci.item.id === orderItem.id,
            );

            if (cartItem === undefined) {
                cartItems.push({
                    item: orderItem,
                    amount: 1,
                });
            } else {
                cartItem.amount++;
            }

            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
        this.dispatchCartUpdatedEvent(cartItems);
    }

    private dispatchCartUpdatedEvent(cartItems: CartItem[]): void {
        this.dispatchEvent(
            new CustomEvent("cart-updated", {
                detail: {
                    cartItems,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private async getUserInformation(): Promise<void> {
        const userInformation: UserHelloResponse | undefined = await this._userService.getWelcome();
        if (!userInformation || !userInformation.user) return;

        this.loggedIn = true;

        if (!userInformation.user.authorizationLevel) return;

        if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            userInformation.user.authorizationLevel === AuthorizationLevel.EMPLOYEE || userInformation.user.authorizationLevel === AuthorizationLevel.ADMIN
        ) {
            this.employeeOrHigher = true;
        }
    }

    private async setOrderItemAsFeatured(id: number, setFeatured: boolean): Promise<void> {
        await this._orderItemService.setOrderAsFeatured(id, setFeatured);
        await this.getFeaturedItems();
    }
}
