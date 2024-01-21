import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY || "";

const stripe = new Stripe(key, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  try {
    if (body.length > 0) {
      const session = await stripe.checkout.sessions.create({
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [],
        invoice_creation: {
          enabled: true,
        },
        line_items: body.map((item: any) => {
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100,
            },
            quantity: 1,
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 10,
            },
          };
        }),
        phone_number_collection: {
          enabled: false,
        },

        success_url: `${process.env.url}/bookings`,
        cancel_url: `${process.env.url}/explore`,
      });
      return NextResponse.json({ session });
    } else {
      return NextResponse.json({ message: "No Data Found" });
    }
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(err.message);
  }
}