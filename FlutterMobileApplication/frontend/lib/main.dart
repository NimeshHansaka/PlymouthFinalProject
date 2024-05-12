// import 'package:flutter/material.dart';
// import 'package:frontend/paypal_payment.dart';
//
// void main() {
//   runApp(const MyApp());
// }
//
// class MyApp extends StatelessWidget {
//   const MyApp({Key? key}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return const MaterialApp (
//       debugShowCheckedModeBanner: false,
//       home: Dashboard(),
//     );
//   }
// }
//
// class Dashboard extends StatelessWidget {
//   const Dashboard({Key? key}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Paypal Payment'),
//       ),
//       body: Center(
//         child: Padding(
//           padding: EdgeInsets.symmetric(horizontal: 30),
//           child: ElevatedButton(
//             onPressed: () {
//               // lets assume that product price is 5.99 usd
//               Navigator.push
//                 (context,
//                   MaterialPageRoute(builder: (context)=> const PaypalPayment(amount: 5.99, currency: 'USD',),));
//             },
//             style: ButtonStyle(
//               backgroundColor: MaterialStateProperty.all(Colors.blue),
//             ),
//             child: Row(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 Image.asset(
//                   "assets/paypal.png",
//                   height: 40,
//                 ),
//                 SizedBox(
//                   width: 10,
//                 ),
//                 Text(
//                   'Pay with Paypal',
//                 )
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }





import 'package:flutter/material.dart';
import 'package:frontend/paypal_payment.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Dashboard(),
    );
  }
}

class Dashboard extends StatefulWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

  late QRViewController controller;
  String scannedAmount = '';

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Paypal Payment'),
      ),
      body: Column(
        children: [
          Expanded(
            flex: 4,
            child: QRView(
              key: qrKey,
              onQRViewCreated: _onQRViewCreated,
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: Text(
                'Scanned Amount: $scannedAmount',
                style: const TextStyle(fontSize: 18),
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: ElevatedButton(
                onPressed: () {
                  if (scannedAmount.isNotEmpty) {
                    double amount = double.tryParse(scannedAmount) ?? 0.0;
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => PaypalPayment(amount: amount, currency: 'USD'),
                      ),
                    );
                  } else {
                    // Show error message or handle empty amount
                  }
                },
                style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all(Colors.blue),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                  "assets/paypal.png",
                  height: 40,
                ),
                    SizedBox(
                      width: 10,
                    ),
                    Text(
                      'Pay with Paypal',
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      setState(() {

        scannedAmount = scanData.code ?? '';
      });
    });
  }
}


