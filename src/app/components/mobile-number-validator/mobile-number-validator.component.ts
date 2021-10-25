import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/services/validator.service';
import { MobileDetails } from '../models/mobile-details.model';
declare let $: any;

@Component({
  selector: 'app-mobile-number-validator',
  templateUrl: './mobile-number-validator.component.html',
  styleUrls: ['./mobile-number-validator.component.scss']
})
export class MobileNumberValidatorComponent implements OnInit {

  countryCodes: any[] = [];
  countryCode: any = ''
  mobileNumber: any = ''
  isInvalidNumber: boolean = false;
  isInvalidCode: boolean = false;
  mobileNumberErrorMsg: string = '';
  isShowModel: boolean = false;
  mobileDetails: MobileDetails = new MobileDetails();

  constructor(private validatorService: ValidatorService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCountryCodes();
  }

  getCountryCodes(){
    this.validatorService.getCountryCodes().subscribe(response => {
      Object.entries(response).forEach(([key, value]) => {
        this.countryCodes.push({ code: key, country: value})
      })
    })
  }

  onEditMobileNumber(event: any){
    var inp = String.fromCharCode(event.target.value);
    if(this.mobileNumber == '') {
      this.mobileNumberErrorMsg = 'Please enter a mobile number.';
      this.isInvalidNumber = true;
    } else {
      if (!(/^[0-9]*$/.test(event.target.value))) {
        this.isInvalidNumber = true;
        this.mobileNumberErrorMsg = 'Please enter a valid mobile number.';
      } else {
        this.isInvalidNumber = false;
      }
    }
  }

  onChangeCountryCode(){
    this.isInvalidCode = this.countryCode == '';
  }

  onCloseModel(){
    this.isShowModel = false;
    this.mobileNumber = '';
    this.countryCode = '';
    $('#mobile-details').modal('hide');
  }

  validateUI(){
    let isValid = true;
    if(this.countryCode == '') { this.isInvalidCode = true; isValid = false && isValid;}
    if(this.mobileNumber == '') { this.isInvalidNumber = true; this.mobileNumberErrorMsg = 'Please enter a mobile number.'; isValid = false && isValid;}
    if(!(/^[0-9]*$/.test(this.mobileNumber ))) { this.isInvalidNumber = true; this.mobileNumberErrorMsg = 'Please enter a valid mobile number.'; isValid = false && isValid;}
    return isValid;
  }

  onValidateMobileNumber() {
    if(this.validateUI()) {
      this.validatorService.validateMobileNumber(this.mobileNumber, this.countryCode).subscribe(response => {
        if(response.valid) {
          console.log(response)
          this.isShowModel = true;
          $('#mobile-details').modal('show');
          this.mobileDetails = response;
          this.toastr.success('Valid Mobile number', 'Success')
        } else {
          if(response.hasOwnProperty('valid')) {
            this.toastr.error('Invalid Mobile number', 'Error')
          } else {
            this.toastr.error(response.error.info, 'Error')
          }
        }
      })
    }
  }

}
