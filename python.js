var BPJSKES, Biaya_Jabatan, Gaji_Bersih, Gaji_Pokok, JKK, JKM, Netto_Bulan, Netto_Tahun, PKP, PPH21_Bulan, PPH21_Tahun, PTKP, Tarif_Pajak, Total_Gaji, Tunj_Pajak, Tunj_lain, bulan_msk, mark, mark_gaji, metode, status;

for (var i = 0, _pj_a = df_input.length; i < _pj_a; i += 1) {
  Gaji_Pokok = Number.parseInt(df_input[i]["Gaji_Pokok"]);
  Tunj_lain = Number.parseInt(df_input[i]["Tunjangan"]);
  status = df_input[i]["Status"];
  metode = df_input[i]["Metode"];
  bulan_msk = df_input[i]["Bulan_Masuk"];
  bulan_msk = 13 - Number.parseInt(bulan_msk);
  JKK = Number.parseInt(Gaji_Pokok * 0.24 / 100);
  JKM = Number.parseInt(Gaji_Pokok * 0.3 / 100);
  BPJSKES = Number.parseInt(Gaji_Pokok * 5 / 100);

  if (BPJSKES > 600000) {
    BPJSKES = 600000;
  }

  for (var i = 0, _pj_b = df_status.length; i < _pj_b; i += 1) {
    if (status === df_status[i]["STATUS"]) {
      PTKP = df_status[i]["PTKP"];
    }
  }

  if (metode === "GROSS UP") {
    Total_Gaji = sum([Gaji_Pokok, JKK, JKM, BPJSKES, Tunj_lain]);
    Biaya_Jabatan = Number.parseInt((Gaji_Pokok + Tunj_lain) * 5 / 100);

    if (Biaya_Jabatan > 500000) {
      Biaya_Jabatan = 500000;
    }

    Netto_Bulan = Total_Gaji - Biaya_Jabatan;
    Netto_Tahun = bulan_msk * Netto_Bulan;
    PKP = Number.parseInt(Netto_Tahun - PTKP);

    if (PKP < 0) {
      Tarif_Pajak = 0;
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
    mark_gaji = Total_Gaji;
    [mark, Tunj_Pajak] = [0, 1];

    while (Gaji_Bersih !== mark_gaji && mark !== Tunj_Pajak) {
      Total_Gaji = sum([Gaji_Pokok, JKK, JKM, BPJSKES, Tunj_lain, PPH21_Bulan]);
      Biaya_Jabatan = Number.parseInt((Gaji_Pokok + Tunj_lain) * 5 / 100);

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

    console.log("Total_Gaji ", Total_Gaji);
    console.log("PPH21_Bulan ", PPH21_Bulan);
  } else {
    Total_Gaji = sum([Gaji_Pokok, JKK, JKM, BPJSKES, Tunj_lain]);
    Biaya_Jabatan = Number.parseInt((Gaji_Pokok + Tunj_lain) * 5 / 100);

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
    console.log(PPH21_Bulan);
  }
}
