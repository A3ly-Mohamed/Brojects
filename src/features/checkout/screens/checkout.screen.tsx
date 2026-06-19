"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faShieldAlt,
  faTruck,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shippingAdressSchema,
  shippingAdressValues,
} from "../schemas/checkout.schema";
import ShippingForm from "../components/ShippingForm";
import PaymentMethods from "../components/PaymentMethods";
import { createCashOrder, createOnlineOrder } from "../server/checkout.actions";
import { useAppDispatch, useAppSelector } from "@/features/auth/store/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { clearCart } from "@/features/cart/store/cart.slice";

export default function CheckoutScreen() {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { cartId } = useAppSelector((state) => state.cart);
  const router = useRouter();
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      details: "",
      phone: "",
      city: "",
    },
    resolver: zodResolver(shippingAdressSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<shippingAdressValues> = async (values) => {
    try {
      console.log("Checkout onSubmit cartId:", cartId);
      if (!cartId) {
        toast.error("Cart ID is missing. Please try refreshing the page.");
        return;
      }

      if (paymentMethod == "cash") {
        const response = await createCashOrder({
          cartId,
          shippingAddress: values,
        });

        console.log(response);


        if (response.status == "success") {
          toast.success("order created  successfully");
          dispatch(clearCart())
          reset();
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      } else {
        console.log("Checkout onSubmit called, paymentMethod:", paymentMethod, "values:", values);
        const response = await createOnlineOrder({
          cartId,
          shippingAddress: values,
          url: location.origin,
        });

        if (response.status === "success") {
          dispatch(clearCart())
          toast.loading("Redirecting you to payment gateway...");
          setTimeout(() => {
            location.href = response.session.url;
          }, 1500);
        } else {
          console.error("Invalid createOnlineOrder response:", response);
          toast.error(response?.message || "Unable to start payment session. See debug output.");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      console.log("helllo")
      toast.error("Something went wrong during checkout.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-primary-600">
              Cart
            </Link>
            <span>/</span>
            <span className="text-primary-600 font-semibold">Checkout</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Order
              </h1>
              <p className="text-gray-600">
                Review your items and complete your purchase
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4   py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Checkout Form Area */}
          <div className="lg:col-span-2">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-8"
            >
              <FontAwesomeIcon icon={faArrowLeft} width={16} />
              Back to Cart
            </Link>

            {/* Placeholder for checkout form */}
            <form
              id="checkout-form"
              action=""
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <ShippingForm register={register} errors={errors} />
                  <PaymentMethods
                    selectedMethod={paymentMethod}
                    changeMethod={setPaymentMethod}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div>
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-8">
              {/* Header */}
              <div className="bg-primary-600 text-white px-6 py-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldAlt} width={20} />
                <h2 className="text-lg font-bold">Order Summary</h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">500 EGP</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faTruck}
                      className="text-gray-500"
                      width={16}
                    />
                    <span className="text-gray-600">Shipping</span>
                  </div>
                  <span className="font-semibold text-primary-600">FREE</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                  </span>
                </div>
              </div>

              {/* Button */}
              <div className="px-6 pb-6">
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faTag} width={18} />
                  Proceed to Payment
                </button>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-around text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon
                      icon={faShieldAlt}
                      className="text-green-500"
                      width={16}
                    />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon
                      icon={faTruck}
                      className="text-blue-500"
                      width={16}
                    />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon
                      icon={faTag}
                      className="text-orange-500"
                      width={16}
                    />
                    <span>Easy Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
