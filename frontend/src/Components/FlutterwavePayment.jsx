import React from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

const FlutterwavePayment = ({ amount, onSuccess, onFailure }) => {
  const config = {
    public_key: 'FLWPUBK_TEST-e5aaab46036de05fac7792675f9aa890-X',
    tx_ref: Date.now(),
    amount: amount,
    currency: 'RWF',
    country: 'RW',
    payment_options: 'card,banktransfer,ussd,barter,paga,mobilemoney,bank_transfer,account,mpesa',
    customer: {
      email: 'customer@example.com',
      phonenumber: '250',
      name: 'John Doe',
    },
    customizations: {
      title: 'Garb Rehab',
      description: 'Payment for some Garb!',
    },
  };

  const fwConfig = {
    ...config,
    text: 'Pay Now',
    callback: (response) => {
      if (response.status === "successful") {
        onSuccess(response);
      } else {
        onFailure(response);
      }
      closePaymentModal();
    },
    onClose: () => {},
  };

  return <FlutterWaveButton {...fwConfig} />;
};

export default FlutterwavePayment;
