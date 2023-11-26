const {request, response} = require("express");
const express = require("express");
const { Op } = require("sequelize");
const app = express();
const axios = require('axios');

app.use(express.json());

const models = require("../models/index");

const customer = models.customers;
const account = models.account;
const transaction = models.transactions;

app.post("/daftar", async(request,response)=>{
    try {
        let dataCustomer = await customer.findOne({
            where:{
                [Op.or]: [{nik: request.body.nik}, {no_hp: request.body.no_hp}]
            }
        });
    
        if (dataCustomer) {
            response.status(400).json({
              remark: "Data telah digunakan!",
            });
            return;
        }
    
        const accountNumber = Math.floor(Math.random() * 9000) + 1000;

        let newCustomer = {
            nama: request.body.nama,
            nik: request.body.nik,
            no_hp: request.body.no_hp
        };
    
        const createdCustomer = await customer.create(newCustomer);
    
        const newAccount = {
            id_account : accountNumber, 
            id_customer: createdCustomer.id_customer,
            saldo: 0,
        };
    
        await account.create(newAccount)

        return response.json({
            message: "Data pelanggan dan akun berhasil ditambahkan!",
            no_rekening : accountNumber
        });
    } catch (err) {
        return response.status(400).json({
            remark: err.message,
        });
    } 
})

app.post("/tabung", async(request,response)=>{
    try {
        const findData = await account.findOne({
            where :{id_account: request.body.no_rekening}
        })

        if (!findData) {
            response.status(400).json({
              remark: "Nomor rekening anda tidak ditemukan!",
            });
            return;
        }

        const nominal = request.body.nominal;
        const hasilSaldo = findData.saldo + nominal;

        let newTransaction = {
            id_account: request.body.no_rekening,
            amount: nominal,
            kode_transaksi: "C",
        }
        
        let res = await axios.post('http://127.0.0.1:8001/api/mutasi', newTransaction);

        await account.update(
            {
                saldo: hasilSaldo
            },
            {
                where: {
                    id_account: request.body.no_rekening
                }
            }
        )

        // await transaction.create(newTransaction);
        return response.json({
            message: "Proses tabungan anda telah selesai!",
            saldo: hasilSaldo
        });
    } catch (err) {
        return response.status(400).json({
            remark: err.message,
        });
    }
})

app.post("/tarik", async(request, response)=>{
    try {
        const findData = await account.findOne({
            where :{id_account: request.body.no_rekening}
        })
    
        if (!findData) {
            response.status(400).json({
              remark: "Nomor rekening anda tidak ditemukan!",
            });
            return;
        }
    
        const nominal = request.body.nominal;
    
        if (nominal > findData.saldo) {
            response.status(400).json({
              remark: "Saldo anda tidak mencukupi!",
            });
            return;
        }
    
        const hasilSaldo = findData.saldo - nominal;
        let newTransaction = {
            id_account: request.body.no_rekening,
            amount: nominal,
            kode_transaksi: "D",
        }

        let res = await axios.post('http://127.0.0.1:8001/api/mutasi', newTransaction);

        await account.update(
            {
                saldo: hasilSaldo
            },
            {
                where: {
                    id_account: request.body.no_rekening
                }
            }
        )
        // await transaction.create(newTransaction);
        return response.json({
            message: "Proses penarikan anda telah selesai!",
            saldo: hasilSaldo
        });
    } catch (err) {
        return response.status(400).json({
            remark: err.message,
        });
    }
})

app.get("/saldo/:no_rekening", async(request,response)=>{
    try {
        const Data = await account.findOne({
            where :{id_account: request.params.no_rekening}
        })

        if (!Data) {
            response.status(400).json({
              remark: "Nomor rekening anda tidak ditemukan!",
            });
            return;
        }

        return response.json({
            message: "Pengecekan saldo anda telah selesai",
            saldo: Data.saldo
        });
    } catch (err) {
        return response.status(400).json({
            remark: err.message,
        });
    }
})

app.get("/mutasi/:no_rekening", async(request, response)=>{
    try {
        const Data = await transaction.findAll({
            where :{id_account: request.params.no_rekening}
        })

        if (!Data) {
            response.status(400).json({
              remark: "Nomor rekening anda tidak ditemukan!",
            });
            return;
        }

        return response.json({
            message: "Pengecekan mutasi anda telah selesai",
            Data: Data
        });
    } catch (err) {
        return response.status(400).json({
            remark: err.message,
        });
    }
})

module.exports = app;