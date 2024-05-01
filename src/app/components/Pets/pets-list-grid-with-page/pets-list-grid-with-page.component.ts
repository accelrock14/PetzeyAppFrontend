import { Component, OnInit } from '@angular/core';
import { IPet } from '../../../models/Pets/IPet';
import { IPetFilterParams } from '../../../models/Pets/IPetFilterParams';
import { PetsService } from './../../../services/PetsServices/pets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgePipe } from "../../../pipes/Age/age.pipe";

@Component({
    selector: 'app-pets-list-grid-with-page',
    templateUrl: './pets-list-grid-with-page.component.html',
    styleUrls: ['./pets-list-grid-with-page.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, AgePipe]
})
export class PetsListGridWithPagesComponent implements OnInit {

  speciesOptions = ['Dog', 'Cat', 'Reptile', 'Other'];
  pets: IPet[] = [];
  petsFilter: IPetFilterParams = {
    PetName: "",
    Species: "",
    PetIDs: []
  };

  currentPage = 1;
  itemsPerPage = 2; // Change this value as per your requirement
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private petsService: PetsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const pageNumber = +params['page'];
      if (!isNaN(pageNumber) && pageNumber > 0) {
        this.currentPage = pageNumber;
        this.filterPetsPerPage(pageNumber);
      } else {
        this.filterPetsPerPage(1);
      }
    });
  }

  filterPetsPerPage(page: number): void {
    this.petsService.FilterPetsPerPage(this.petsFilter, page, this.itemsPerPage).subscribe(pets => {
      this.pets = pets;
      this.currentPage = page;
      this.calculateTotalPages();
    });
  }

  calculateTotalPages(): void {
    this.petsService.GetPetsCount(this.petsFilter).subscribe(count => {
      this.totalPages = Math.ceil(count / this.itemsPerPage);
      this.generatePageNumbers();
    });
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number): void {
    this.filterPetsPerPage(page);
    this.updateRoute(page);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      const prevPage = this.currentPage - 1;
      this.filterPetsPerPage(prevPage);
      this.updateRoute(prevPage);
    }
  }

  nextPage(): void {
    const nextPage = this.currentPage + 1;
    this.petsService.FilterPetsPerPage(this.petsFilter, nextPage, this.itemsPerPage).subscribe(pets => {
      if (pets.length > 0) {
        this.filterPetsPerPage(nextPage);
        this.updateRoute(nextPage);
      }
    });
    console.log(this.pets)
  }

  updateRoute(page: number): void {
    this.router.navigateByUrl(`/pets/${page}`);
  }
}