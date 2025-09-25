import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MainserviceService } from '../service/mainservice.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  private refreshInterval: any;
  selectedDate: string = new Date().toISOString().split('T')[0];
  inputVal: string = '';

  displayedColumns: string[] = [
    'slNo',
    'TruckNo',
    'TransactionNumber',
    'GrossWeight',
    'TareWeight',
    'NetWeight',
    'STONumber',
    'CargoGrade',
    'CustomerName',
    'VesselName',
    'SecurityInDateTime',
    'Print',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: MainserviceService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchData() {
    if (!this.selectedDate || !this.inputVal.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill both Date and Truck/Transaction Number before searching!',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    this.service
      .getTruckTransaction(this.selectedDate, this.inputVal)
      .subscribe((res: any) => {
        if (res.status) {
          this.dataSource.data = res.data;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.dataSource.data = [];
          Swal.fire({
            icon: 'error',
            title: 'No Data Found',
            text: res.message || 'No records match your search!',
          });
        }
      });
  }

  clearData() {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.inputVal = '';
    this.dataSource.data = [];
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  printRow(row: any) {
    const printContent = `
    <div style="width: 100%; max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 12px;">
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
        <tr>
          <td colspan="4" style="text-align: center; border: 1px solid #000; padding: 10px; background-color: #f0f0f0;">
            <h2 style="margin: 0; font-size: 20px;">VIZAG GENERAL CARGO BERTH PVT LTD</h2>
            <h3 style="margin: 0; font-size: 16px;">Visakhapatnam</h3>
            <h3 style="margin: 0; font-size: 12px;">Weighing Slip</h3>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px; width: 25%;">Transaction No</td>
          <td style="border: 1px solid #000; padding: 5px; width: 25%;">${
            row.TransactionNumber
          }</td>
          <td style="border: 1px solid #000; padding: 5px; width: 25%;">Reg. DateTime</td>
          <td style="border: 1px solid #000; padding: 5px; width: 25%;">${new Date(
            row.RegDateTime
          ).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Truck No</td>
          <td style="border: 1px solid #000; padding: 5px;">${row.TruckNo}</td>
          <td style="border: 1px solid #000; padding: 5px;">Vehicle Type</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.VehicleNo
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Trip Type</td>
          <td style="border: 1px solid #000; padding: 5px;">${row.TripType}</td>
          <td style="border: 1px solid #000; padding: 5px;">Transporter</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.Transporter || '-'
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Supplier</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.Supplier || '-'
          }</td>
          <td style="border: 1px solid #000; padding: 5px;">Cargo Grade</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.CargoGrade
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Material</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.Material || '-'
          }</td>
          <td style="border: 1px solid #000; padding: 5px;">Customer Name</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.CustomerName
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">WB ID</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.WBID || '-'
          }</td>
          <td style="border: 1px solid #000; padding: 5px;">Vessel Name</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.VesselName
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Route No</td>
          <td style="border: 1px solid #000; padding: 5px;">${row.RouteNo}</td>
          <td style="border: 1px solid #000; padding: 5px;"></td>
          <td style="border: 1px solid #000; padding: 5px;"></td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Gross Wt</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.GrossWeight || '-'
          }</td>
          <td style="border: 1px solid #000; padding: 5px;">Date / Time</td>
          <td style="border: 1px solid #000; padding: 5px;">${new Date(
            row.GrossWeightDateTime
          ).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Tare Wt</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.TareWeight || '-'
          }</td>
          <td style="border: 1px solid #000; padding: 5px;">Date / Time</td>
          <td style="border: 1px solid #000; padding: 5px;">${new Date(
            row.TareWeightDateTime
          ).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">Net Wt</td>
          <td style="border: 1px solid #000; padding: 5px;">${
            row.NetWeight || '-'
          }</td>
          <td style="border: 1px solid #000; padding: 5px;"></td>
          <td style="border: 1px solid #000; padding: 5px;"></td>
        </tr>
        <tr>
          <td colspan="4" style="border: 1px solid #000; padding: 5px; text-align: center;">
            Operator Signature:
          </td>
        </tr>
      </table>
    </div>
  `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print</title>');
      printWindow.document.write(
        '<style>body { margin: 0; padding: 0; }</style>'
      );
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'No, stay logged in',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval);
        }
        this.service.logout();
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
