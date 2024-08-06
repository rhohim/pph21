var loadBtn = document.querySelector("#section1")
var display = document.querySelector("#section2")


// Start Test
function Upload() {
  var fileUpload = document.getElementById("fileUpload");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
      if (typeof (FileReader) != "undefined") {
          var reader = new FileReader();
          reader.onload = function (e) {
              var table = document.createElement("table");
              var rows = e.target.result.split("\n");
              for (var i = 0; i < rows.length; i++) {
                  var cells = rows[i].split(",");
                  if (cells.length > 1) {
                      var row = table.insertRow(-1);
                      for (var j = 0; j < cells.length; j++) {
                          var cell = row.insertCell(-1);
                          cell.innerHTML = cells[j];
                      }
                  }
              }
              // var dvCSV = document.getElementById("dvCSV");
              // dvCSV.innerHTML = "";
              // dvCSV.appendChild(table);

              // console.log(reader.result)
              document.getElementById("fileUpload").value =""
              let csv = Papa.parse(reader.result,{ 
                delimiter: "", // auto-detect 
                newline: "", // auto-detect 
                quoteChar: '"', 
                escapeChar: '"', 
                header: true, // creates array of {head:value} 
                dynamicTyping: false, // convert values to numbers if possible
                skipEmptyLines: true 
              }); 
              
              console.log(csv.data);
              localStorage.setItem('datacsv', JSON.stringify(csv.data))
              location.reload()
          }
          reader.readAsText(fileUpload.files[0]);
      } else {
          alert("This browser does not support HTML5.");
      }
  } else {
      alert("Please upload a valid CSV file.");
  }
}


  var getLocal = localStorage.getItem("datacsv")
let r = JSON.parse(getLocal)
let dataPph = r
console.log(dataPph)
// for (let i = 0; i < dataPph.length; i++) {
//   // console.log(i+1)
// }

function mainFormula() {

  var BPJSKES, Biaya_Jabatan, Gaji_Bersih, Gaji_Pokok, JKK, JKM, Netto_Bulan, Netto_Tahun, PKP, PPH21_Bulan, PPH21_Tahun, PTKP, Tarif_Pajak, Total_Gaji, Tunj_Pajak, Tunj_lain, bulan_msk, mark, mark_gaji, metode, status;
  let Pajak60 = 3000000
  let Trf60 = 60000000
  for (var i = 0, count = dataPph.length; i < count; i += 1) {
    Gaji_Pokok = Number.parseInt(dataPph[i]["Gaji_Pokok"]);
    Tunj_lain = Number.parseInt(dataPph[i]["Tunjangan"]);
    status = dataPph[i]["Status"];
    metode = dataPph[i]["Metode"];
    bulan_msk = dataPph[i]["Bulan_Masuk"];
    bulan_msk = 13 - Number.parseInt(bulan_msk);
    JKK = Number.parseInt(Gaji_Pokok * 0.24 / 100);
    JKM = Number.parseInt(Gaji_Pokok * 0.3 / 100);
    BPJSKES = Number.parseInt(Gaji_Pokok * 5 / 100);
    // console.log(Gaji_Pokok) < -- Looping Output
    if (BPJSKES > 600000) {
      BPJSKES = 600000;
    }

    var df_status = [
      {
        "STATUS": "TK0",
        "PTKP": 54000000
      },
      {
        "STATUS": "K0",
        "PTKP": 58500000
      },
      {
        "STATUS": "K1",
        "PTKP": 63000000
      },
      {
        "STATUS": "K2",
        "PTKP": 67500000
      },
      {
        "STATUS": "K3",
        "PTKP": 72000000
      },
      {
        "STATUS": "TK1",
        "PTKP": 58500000
      },
      {
        "STATUS": "TK2",
        "PTKP": 63000000
      },
      {
        "STATUS": "TK3",
        "PTKP": 67500000
      }
    ]

    for (var x = 0, _pj_b = df_status.length; x < _pj_b; x += 1) {
      if (status === df_status[x]["STATUS"]) {
        PTKP = df_status[x]["PTKP"];
      }
    }
    
    // GROSS UP Metode
    if (metode === "GROSS UP") {
      var Total_Gaji = Gaji_Pokok + JKK + JKM + BPJSKES + Tunj_lain
      var Biaya_Jabatan = Number.parseInt((Gaji_Pokok + Tunj_lain) * 5 / 100);

      if (Biaya_Jabatan > 500000) {
        Biaya_Jabatan = 500000;
      }

      var Netto_Bulan = Total_Gaji - Biaya_Jabatan;
      var Netto_Tahun = bulan_msk * Netto_Bulan;
      var PKP = Number.parseInt(Netto_Tahun - PTKP);

      if (PKP < 0) {
        Tarif_Pajak = 0;
      } else {
        if (PKP <= Trf60) {
          var Tarif_Pajak = Number.parseInt(PKP * 5 / 100);
          var PPH21_Tahun = Number.parseInt(Tarif_Pajak);
          var PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
        } else {
          if (PKP > Trf60 && PKP <= 250000000) {
            var Tarif_Pajak = Number.parseInt((PKP - Trf60) * 15 / 100);
            var PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
            var PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
          } else {
            if (PKP > 250000000 && PKP <= 500000000) {
              var Tarif_Pajak = Number.parseInt((PKP - Trf60) * 25 / 100);
              var PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
              var PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
            } else {
              var Tarif_Pajak = Number.parseInt((PKP - Trf60) * 30 / 100);
              var PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
              var PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
            }
          }
        }
      }

      var Gaji_Bersih = Total_Gaji - PPH21_Bulan;
      var mark_gaji = Total_Gaji;
      [mark, Tunj_Pajak] = [0, 1];

      while (Gaji_Bersih !== mark_gaji && mark !== Tunj_Pajak) {
        var Total_Gaji = Gaji_Pokok+ JKK+ JKM+ BPJSKES+ Tunj_lain+ PPH21_Bulan
        var Biaya_Jabatan = Number.parseInt((Gaji_Pokok + Tunj_lain) * 5 / 100);

        if (Biaya_Jabatan > 500000) {
          Biaya_Jabatan = 500000;
        }

        Netto_Bulan = Total_Gaji - Biaya_Jabatan;
        Netto_Tahun = bulan_msk * Netto_Bulan;
        PKP = Number.parseInt(Netto_Tahun - PTKP);

        if (PKP < 0) {
          [Tarif_Pajak, PPH21_Tahun, PPH21_Bulan] = [0, 0, 0];
          Gaji_Bersih = Total_Gaji;
        } else {
          if (PKP <= Trf60) {
            Tarif_Pajak = Number.parseInt(PKP * 5 / 100);
            PPH21_Tahun = Number.parseInt(Tarif_Pajak);
            PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
          } else {
            if (PKP > Trf60 && PKP <= 250000000) {
              Tarif_Pajak = Number.parseInt((PKP - Trf60) * 15 / 100);
              PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
              PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
            } else {
              if (PKP > 250000000 && PKP <= 500000000) {
                Tarif_Pajak = Number.parseInt((PKP - Trf60) * 25 / 100);
                PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
                PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
              } else {
                Tarif_Pajak = Number.parseInt((PKP - Trf60) * 30 / 100);
                PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
                PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
              }
            }
          }
        }

        mark = Tunj_Pajak;
        Tunj_Pajak = PPH21_Bulan;
        Gaji_Bersih = Total_Gaji - PPH21_Bulan;
      }

      // Final Output Grossup
      // console.log("Total_Gaji ", Total_Gaji);
      dataPph[i]['Jumlah_Bruto'] = Total_Gaji

      // Final Output Grossup
      // console.log("PPH21_Bulan ", PPH21_Bulan);
      dataPph[i]['Jumlah_PPh'] = PPH21_Bulan

    // NETTO Metode  
    } else {
      var Total_Gaji = Gaji_Pokok+ JKK+ JKM+ BPJSKES+ Tunj_lain;
      var Biaya_Jabatan = Number.parseInt((Gaji_Pokok + Tunj_lain) * 5 / 100);

      if (Biaya_Jabatan > 500000) {
        Biaya_Jabatan = 500000;
      }

      Netto_Bulan = Total_Gaji - Biaya_Jabatan;
      Netto_Tahun = bulan_msk * Netto_Bulan;
      PKP = Number.parseInt(Netto_Tahun - PTKP);

      if (PKP < 0) {
        [Tarif_Pajak, PPH21_Tahun, PPH21_Bulan] = [0, 0, 0];
        Gaji_Bersih = Total_Gaji;
      } else {
        if (PKP <= Trf60) {
          Tarif_Pajak = Number.parseInt(PKP * 5 / 100);
          PPH21_Tahun = Number.parseInt(Tarif_Pajak);
          PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
        } else {
          if (PKP > Trf60 && PKP <= 250000000) {
            Tarif_Pajak = Number.parseInt((PKP - Trf60) * 15 / 100);
            PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
            PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
          } else {
            if (PKP > 250000000 && PKP <= 500000000) {
              Tarif_Pajak = Number.parseInt((PKP - Trf60) * 25 / 100);
              PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
              PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
            } else {
              Tarif_Pajak = Number.parseInt((PKP - Trf60) * 30 / 100);
              PPH21_Tahun = Number.parseInt(Tarif_Pajak + Pajak60);
              PPH21_Bulan = Number.parseInt(PPH21_Tahun / 12);
            }
          }
        }
      }

      Gaji_Bersih = Total_Gaji - PPH21_Bulan;

      // Final Output Netto
      // console.log("Total_Gaji ", Total_Gaji);
      dataPph[i]['Jumlah_Bruto'] = Total_Gaji

      // Final Output Netto
      // console.log("PPH21_Bulan ", PPH21_Bulan);
      dataPph[i]['Jumlah_pph'] = PPH21_Bulan
    }
  }

  loadTable()
}

mainFormula()

function loadTable() {
  $(document).ready(function () {
    localStorage.setItem('datacsv', JSON.stringify(dataPph))
    // console.log(Gaji_Pokok, status)
    $("#example").DataTable({
      data: dataPph,
      scrolly: true,
      responsive: true,
      pagingType: 'full_numbers',
      columns: [
        {
          data: "No",
        },
        {
          data: "Nama",
        },
        {
          data: "KTP",
        },
        {
          data: "Gaji_Pokok", render: function (data){
            return data.toLocaleString("en-US")
          }
        },
        {
          data: "Tunjangan", render: function (data){
            return data.toLocaleString("en-US")
          }
        },
        {
          data: "Jumlah_Bruto", render: function (data){
            return data.toLocaleString("en-US")
          }
        },
        {
          data: "Jumlah_pph", render: function (data){
            return data.toLocaleString("en-US")
          }
        },
        {
          data: "No", render: function (data, type) {
            return type === 'display' ?
              '<a class="btn btn-outline-primary" onClick="exportData(' + data + ')">Export</a>' : data
          }
        },
      ],
      paging: false,
    })
  })
}

async function exportData(data) {
  const url = localStorage.getItem("datacsv")
  const passing = (JSON.parse(url)[data - 1])
  console.log(passing)

  const itemsArray = [passing]

  const csvString = [
    [
      "No",
      "Nama",
      "KTP",
      "NPWP",
      "Bulan Masuk",
      "Masa Pajak",
      "Kode Pajak",
      "Pembetulan",
      "Gaji Pokok",
      "Tunjangan",
      "Status",
      "Metode",
      "Kode Negara",
      "Jumlah Bruto",
      "Jumlah PPH"
    ],
    ...itemsArray.map(item => [
      item.No,
      item.Nama,
      item.KTP,
      item.NPWP,
      item.Bulan_Masuk,
      item.Masa_Pajak,
      item.Kode_Pajak,
      item.Pembetulan,
      item.Gaji_Pokok,
      item.Tunjangan,
      item.Status,
      item.Metode,
      item.Kode_Negara,
      item.Jumlah_Bruto,
      item.Jumlah_PPh
    ])
  ]
    .map(e => e.join(","))
    .join("\n")

  // Download CSV
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
  hiddenElement.target = '_blank';

  //provide the name for the CSV file to be downloaded  
  hiddenElement.download = passing.Nama + - + passing.KTP + '.csv';
  hiddenElement.click();
}


const url = localStorage.getItem("datacsv")
const stockData = (JSON.parse(url))


function convertArrayOfObjectsToCSV(args) {
  // console.log(stockData)
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}
function downloadCSV(args) {
  var data, filename, link;
  var csv = convertArrayOfObjectsToCSV({
    data: stockData
  });
  if (csv == null) return;

  filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}


