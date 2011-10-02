/**
 * Author: Ido Green
 * Date: 10/02/2011
 * Some logic to upload the files and get data from the local storage
 * 
 */
var logging = true;
var userEmail, userPassword;

/**
 */
function log(txt) {
  if(logging) {
    console.log(txt);
  }
}
  
/**
 * 
 */
function setItem(key, value) {
  try {
    log("Inside setItem:" + key + ":" + value);
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }catch(e) {
    log("Error inside setItem");
    log(e);
  }
  log("Return from setItem" + key + ":" +  value);
}

/**
 * 
 */
function removeItem(key) {
  try {
    log("Inside removeItem:" + key );
    window.localStorage.removeItem(key);
  }catch(e) {
    log("Error inside removeItem: "+e);
  }
  log("Return from removeItem" + key );
}

/**
 * Gets the item from local storage with the specified key
 */
function getItem(key) {
  var value = null;
  log('Get Item:' + key);
  try {
    value = window.localStorage.getItem(key);
  }catch(e) {
    log("Error inside getItem() for key:" + key);
    log(e);
    value = null;
  }
  log("Returning value: " + value);
  return value;
}

/**
 * 
 */

function FileManager() {
 
  this.uploadServer = null;
  return {

    uploadFile: function(file) {
      if (!this.uploadServer) {
        throw Error('Server endpoint not set... check out what is going with @greenido')
      }
      userEmail = getItem('drop-email');
      userPassword = getItem('drop-password');
      
      if (!userEmail || $('#email').length) {
        userEmail = $('#email').val();
        setItem('drop-email', userEmail);
      }
            
      if (!userPassword || $('#userPassword').length) {
        userPassword = $('#password').val();
        setItem('drop-password', userPassword);
      }
            
      var pro1 = document.querySelector('#pro1');
      $("#pro1").css('visibility', 'visible');
      var progressBar =  pro1.querySelector('progress');
      progressBar.value = 0;
      var formData = new FormData();
      formData.append('email', userEmail);
      formData.append('password', userPassword);
      formData.append('dest', $('#dest').val());
      formData.append('file', file);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.uploadServer, true);
            
      xhr.onload = function(e) {
        if (this.status == 200) {
          
          $('#statusReport').html(this.response);
          alert("Cool - the file is safe in Dropbox");
        }
      };

      xhr.onerror = function(e) {
        console.log(this, this.status, this.responseText, this.getAllResponseHeaders())
      };

      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          progressBar.value = Math.round((e.loaded / e.total) * 100);
          progressBar.textContent = progressBar.value + '%';
          pro1.dataset.percent = progressBar.value;
        }
      };

      xhr.send(formData);
    },

    importFiles: function(fileList) {
      for (var i = 0, file; file = fileList[i]; ++i) {
        (function(f) {
          fs_.root.getFile(file.name, {
            create: true, 
            exclusive: true
          }, function(fileEntry) {

            fileEntry.createWriter(function(fileWriter) {
              fileWriter.write(f)
            }, onFsError_);

          }, onFsError_);
        })(file);
      }

    }

  };
};
