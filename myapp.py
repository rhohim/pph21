# from distutils.command.upload import upload
from flask import Flask, flash, redirect, render_template, request, url_for
import pandas as pd
import os

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "static/excel"

#create status ptkp
status = pd.read_excel('status_pph21.xlsx')
df_status = status.to_dict(orient='records')

#create Tarif_Pajak, PPH21_Tahun, PPH_Bulan
Pajak60 = 3000000 #set pajak to 3jt if more than trf60 (60jt)
Trf60 = 60000000

@app.route('/', methods = ["POST","GET"])
def index():
    
    return render_template('index.html')

@app.route('/pph',  methods = ["POST","GET"])
def pph():
    if request.method == "POST":
        file = request.files['fileinput']
        if file.filename != '':
            filepath =os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
            file.save(filepath)
            input_data = pd.read_excel(file)
            df_input = input_data.to_dict(orient='records')
    for i in range(len(df_input)):
        Gaji_Pokok = int(df_input[i]["Gaji_Pokok"])
        Tunj_lain = int(df_input[i]["Tunjangan"])
        status = df_input[i]["Status"]
        metode = df_input[i]["Metode"]
        bulan_msk = df_input[i]["Bulan_Masuk"]
        # print(Gaji_Pokok,Tunj_lain,status,metode)
        
        #count bulan_masuk
        bulan_msk = 13-int(bulan_msk)
        # print(bulan_msk)
        
        #create JKK,JKM,BPJSKES
        JKK = int(Gaji_Pokok*0.24/100) #JKK 0.24% of Gaji_Pokok
        JKM = int(Gaji_Pokok*0.3/100) #JKM 0.3% of Gaji_Pokok
        BPJSKES = int(Gaji_Pokok*5/100) #BPJSKES 5% of Gaji_Pokok , if more than 600.000 set to 600.000 (max = 600.000)
        if BPJSKES > 600000:
            BPJSKES = 600000
        # print(JKK," ",JKM," ",BPJSKES)
        
        #create PTKP based on status
        for i in range(len(df_status)):
            if status == df_status[i]["STATUS"]:
                PTKP = df_status[i]["PTKP"]

        if metode == "GROSS UP":
            Total_Gaji = sum([Gaji_Pokok,JKK,JKM,BPJSKES,Tunj_lain])
            Biaya_Jabatan = int((Gaji_Pokok+Tunj_lain)*5/100) #Biaya_Jabatan 5% of sum(Gaji_Pokok,Tunj_Lain), 
            if Biaya_Jabatan > 500000:                          #if more than 500.000 set to 500.000 (max = 500.000)
                Biaya_Jabatan = 500000

            Netto_Bulan = Total_Gaji - Biaya_Jabatan
            Netto_Tahun = bulan_msk*Netto_Bulan
            PKP = int(Netto_Tahun - PTKP)
            # print("PKP " , PKP)
            if PKP < 0:
                Tarif_Pajak = 0
            else:
                if PKP <= Trf60:
                    Tarif_Pajak = int(PKP*5/100) #Tarif_Pajak 5% of PKP
                    PPH21_Tahun = int(Tarif_Pajak)
                    PPH21_Bulan = int(PPH21_Tahun/12)
                elif (PKP > Trf60) and (PKP <= 250000000):
                    Tarif_Pajak = int((PKP-Trf60)*15/100) #Tarif_Pajak 15% of PKP
                    PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                    PPH21_Bulan = int(PPH21_Tahun/12)
                elif (PKP > 250000000) and (PKP <= 500000000):
                    Tarif_Pajak = int((PKP-Trf60)*25/100) #Tarif_Pajak 25% of PKP
                    PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                    PPH21_Bulan = int(PPH21_Tahun/12)
                else:
                    Tarif_Pajak = int((PKP-Trf60)*30/100) #Tarif_Pajak 30% of PKP
                    PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                    PPH21_Bulan = int(PPH21_Tahun/12)
            Gaji_Bersih =  Total_Gaji - PPH21_Bulan
            ##########################################
            mark_gaji = Total_Gaji  
            mark, Tunj_Pajak = 0,1
            while Gaji_Bersih != mark_gaji and mark != Tunj_Pajak:
                
                Total_Gaji = sum([Gaji_Pokok,JKK,JKM,BPJSKES,Tunj_lain,PPH21_Bulan])
                Biaya_Jabatan = int((Gaji_Pokok+Tunj_lain)*5/100) #Biaya_Jabatan 5% of sum(Gaji_Pokok,Tunj_Lain), 
                if Biaya_Jabatan > 500000:                          #if more than 500.000 set to 500.000 (max = 500.000)
                    Biaya_Jabatan = 500000

                Netto_Bulan = Total_Gaji - Biaya_Jabatan
                Netto_Tahun = bulan_msk*Netto_Bulan
                PKP = int(Netto_Tahun - PTKP)
                
                if PKP < 0:
                    Tarif_Pajak, PPH21_Tahun, PPH21_Bulan = 0,0,0
                    Gaji_Bersih = Total_Gaji
                else:
                    if PKP <= Trf60:
                        Tarif_Pajak = int(PKP*5/100) #Tarif_Pajak 5% of PKP
                        PPH21_Tahun = int(Tarif_Pajak)
                        PPH21_Bulan = int(PPH21_Tahun/12)
                    elif (PKP > Trf60) and (PKP <= 250000000):
                        Tarif_Pajak = int((PKP-Trf60)*15/100) #Tarif_Pajak 15% of PKP
                        PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                        PPH21_Bulan = int(PPH21_Tahun/12)
                    elif (PKP > 250000000) and (PKP <= 500000000):
                        Tarif_Pajak = int((PKP-Trf60)*25/100) #Tarif_Pajak 25% of PKP
                        PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                        PPH21_Bulan = int(PPH21_Tahun/12)
                    else:
                        Tarif_Pajak = int((PKP-Trf60)*30/100) #Tarif_Pajak 30% of PKP
                        PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                        PPH21_Bulan = int(PPH21_Tahun/12)
                mark = Tunj_Pajak
                Tunj_Pajak = PPH21_Bulan
                Gaji_Bersih =  Total_Gaji - PPH21_Bulan
            print("Total_Gaji ", Total_Gaji)
            print("PPH21_Bulan ",PPH21_Bulan)
            
        else: #NETTO
            # print(Gaji_Pokok,Tunj_lain)
            print("Gaji Pokok " , Gaji_Pokok)
            print("Tunjangan " , Tunj_lain)
            Total_Gaji = sum([Gaji_Pokok,JKK,JKM,BPJSKES,Tunj_lain])
            Biaya_Jabatan = int((Gaji_Pokok+Tunj_lain)*5/100) #Biaya_Jabatan 5% of sum(Gaji_Pokok,Tunj_Lain), 
            if Biaya_Jabatan > 500000:                          #if more than 500.000 set to 500.000 (max = 500.000)
                Biaya_Jabatan = 500000
            print("Total Gaji " , Total_Gaji)
            print("Biaya_Jabatan " , Biaya_Jabatan)
            Netto_Bulan = Total_Gaji - Biaya_Jabatan
            Netto_Tahun = bulan_msk*Netto_Bulan
            PKP = int(Netto_Tahun - PTKP)
            print("netto bulan " , Netto_Bulan)
            print("netto tahun " , Netto_Tahun)
            print("PKP ",PKP)
            
            if PKP < 0:
                Tarif_Pajak, PPH21_Tahun, PPH21_Bulan = 0,0,0
                Gaji_Bersih = Total_Gaji
            else:
                if PKP <= Trf60:
                    Tarif_Pajak = int(PKP*5/100) #Tarif_Pajak 5% of PKP
                    PPH21_Tahun = int(Tarif_Pajak)
                    PPH21_Bulan = int(PPH21_Tahun/12)
                elif (PKP > Trf60) and (PKP <= 250000000):
                    Tarif_Pajak = int((PKP-Trf60)*15/100) #Tarif_Pajak 15% of PKP
                    PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                    PPH21_Bulan = int(PPH21_Tahun/12)
                elif (PKP > 250000000) and (PKP <= 500000000):
                    Tarif_Pajak = int((PKP-Trf60)*25/100) #Tarif_Pajak 25% of PKP
                    PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                    PPH21_Bulan = int(PPH21_Tahun/12)
                else:
                    Tarif_Pajak = int((PKP-Trf60)*30/100) #Tarif_Pajak 30% of PKP
                    PPH21_Tahun = int(Tarif_Pajak+Pajak60)
                    PPH21_Bulan = int(PPH21_Tahun/12)
            Gaji_Bersih =  Total_Gaji - PPH21_Bulan
            print(PPH21_Bulan)
               
    return ("index.html")
    
 
if __name__ == "__main__":
    app.run(debug=True)