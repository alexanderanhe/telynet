import {AfterViewInit, OnInit, Component, ViewChild} from '@angular/core';
import { IssuesService } from '../services/issues.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../dialogs/add/add.dialog.component';
import { Issue } from '../models/issue';
import { EditDialogComponent } from '../dialogs/edit/edit.dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete/delete.dialog.component';

const ELEMENT_DATA: Issue[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [ 'code', 'name', 'address', 'population', 'cp', 'city', 'telephone', 'email', 'tools' ];
  dataSource = new MatTableDataSource<Issue>();

  code: string;
  resultsLength = 0;
  isLoadingResults;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    public _issueService: IssuesService,
    public _dialogService: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.sort)
    // this._sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.getData()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getData() {
    this.isLoadingResults = true;
    this._issueService.get()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Issue>(data)
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.length;
      })
  }

  newIssue() {
    const dialogRef = this._dialogService.open(AddDialogComponent, {
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // 
        this.getData()
        this.refreshTable();
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  edit(code: string) {
    this.code = code;
    const issue = this.dataSource.filteredData.filter(is => is.code === code)
    const dialogRef = this._dialogService.open(EditDialogComponent, {
      data: issue[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // 
        // And lastly refresh table
        this.getData()
        this.refreshTable();
      }
    });
  }

  delete(code: string) {
    this.code = code;
    const issue = this.dataSource.filteredData.filter(is => is.code === code)
    const dialogRef = this._dialogService.open(DeleteDialogComponent, {
      data: issue[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // 
        // And lastly refresh table
        this.getData()
        this.refreshTable();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
