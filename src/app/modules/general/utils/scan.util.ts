import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Injectable({
  providedIn: 'root',
})
export class ScanUtil {
  constructor(private qrScanner: QRScanner) {}
  prepareAndGetCameraAuthorization() {
    return new Promise((resolve, reject) => {
      this.qrScanner
        .prepare()
        .then((status: QRScannerStatus) => {
          if (status.authorized) {
            resolve(true);
          } else if (status.denied) {
            reject(false);
          } else {
            reject(false);
          }
        })
        .catch((e: any) => {
          alert('Error is' + e);
        });
    });
  }
  activateCamera() {
    return new Promise((resolve, reject) => {
      this.qrScanner.show().then(
        () => {
          resolve(true);
        },
        () => {
          reject(false);
        }
      );
    });
  }
  // destroyScanner() {
  //   this.qrScanner.destroy();
  // }
  scan(): Observable<String> {
    this.qrScanner.resumePreview();
    return this.qrScanner.scan();
  }
  base64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
