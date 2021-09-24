import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
  selector: 'pm-products',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Product List';
  imageWidth: number = 50;
  imageMargin: number = 2;
  showImage: boolean = false;
  sub!: Subscription;

  // Error message received from the Observable object (message is formatted by catching error with pipes)
  errorMessage: string = '';

  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.performFilter();
  }

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];

  constructor(private productService: ProductService) {}

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    /**
     * ! To unsubscribe store the object of type Subscription and then use unsubscribe() in the ngOnDestroy() hook
     */
    this.sub = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = this.products;
      },
      error: (err) => (this.errorMessage = err),
    });
  }

  performFilter(): IProduct[] {
    // Make case insensitive
    return this.products.filter((product: IProduct) =>
      product.productName.toLowerCase().includes(this.listFilter.toLowerCase())
    );
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }

  ngOnDestroy(): void {
	  this.sub.unsubscribe();
  }
}
