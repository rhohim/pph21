import pandas as pd

def netto(Gaji_Pokok,Tunj_lain,st):
    status = pd.read_excel('status_pph21.xlsx')
    df_status = status.to_dict(orient='records')
    
    #create JKK,JKM,BPJSKES
    JKK = int(Gaji_Pokok*0.24/100) #JKK 0.24% of Gaji_Pokok
    JKM = int(Gaji_Pokok*0.3/100) #JKM 0.3% of Gaji_Pokok
    BPJSKES = int(Gaji_Pokok*5/100) #BPJSKES 5% of Gaji_Pokok , if more than 600.000 set to 600.000 (max = 600.000)
    if BPJSKES > 600000:
        BPJSKES = 600000
    # print(JKK," ",JKM," ",BPJSKES)

    #create PTKP based on status
    for i in range(len(df_status)):
        if st == df_status[i]["STATUS"]:
            PTKP = df_status[i]["PTKP"]
            
    Total_Gaji = sum([Gaji_Pokok,JKK,JKM,BPJSKES,Tunj_lain])
    Biaya_Jabatan = int((Gaji_Pokok+Tunj_lain)*5/100) #Biaya_Jabatan 5% of sum(Gaji_Pokok,Tunj_Lain), 
    if Biaya_Jabatan > 500000:                          #if more than 500.000 set to 500.000 (max = 500.000)
        Biaya_Jabatan = 500000

    Netto_Bulan = Total_Gaji - Biaya_Jabatan
    Netto_Tahun = 12*Netto_Bulan
    PKP = int(Netto_Tahun - PTKP)

    #create Tarif_Pajak, PPH21_Tahun, PPH_Bulan
    Pajak60 = 3000000 #set pajak to 3jt if more than trf60 (60jt)
    Trf60 = 60000000

    if PKP < 0:
        Tarif_Pajak = 0
    else:
        if PKP <= Trf60:
            Tarif_Pajak = PKP*5/100 #Tarif_Pajak 5% of PKP
            PPH21_Tahun = int(Tarif_Pajak)
            PPH21_Bulan = int(PPH21_Tahun/12)
        elif (PKP > Trf60) and (PKP <= 250000000):
            Tarif_Pajak = ((PKP-Trf60)*15/100) #Tarif_Pajak 15% of PKP
            PPH21_Tahun = int(Tarif_Pajak+Pajak60)
            PPH21_Bulan = int(PPH21_Tahun/12)
        elif (PKP > 250000000) and (PKP <= 500000000):
            Tarif_Pajak = ((PKP-Trf60)*25/100) #Tarif_Pajak 25% of PKP
            PPH21_Tahun = int(Tarif_Pajak+Pajak60)
            PPH21_Bulan = int(PPH21_Tahun/12)
        else:
            Tarif_Pajak = ((PKP-Trf60)*30/100) #Tarif_Pajak 30% of PKP
            PPH21_Tahun = int(Tarif_Pajak+Pajak60)
            PPH21_Bulan = int(PPH21_Tahun/12)
        
    # print(Netto_Bulan," ",Netto_Tahun," ",PKP," ",Tarif_Pajak," ",PPH21_Tahun," ",PPH21_Bulan)

    #get Gaji_Bersih
    Gaji_Bersih =  Total_Gaji - PPH21_Bulan
    print("PPH21 Bulan ",PPH21_Bulan)
    



netto(20000000,0,'TK0')