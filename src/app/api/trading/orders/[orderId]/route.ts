import { NextResponse } from "next/server";
import { getOrder, cancelOrder } from "@/lib/api/alpaca";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const o = await getOrder(orderId);
    return NextResponse.json({
      id: o.id,
      clientOrderId: o.client_order_id,
      symbol: o.symbol,
      qty: o.qty,
      notional: o.notional,
      filledQty: o.filled_qty,
      filledAvgPrice: o.filled_avg_price,
      side: o.side,
      type: o.type,
      timeInForce: o.time_in_force,
      status: o.status,
      limitPrice: o.limit_price,
      stopPrice: o.stop_price,
      submittedAt: o.submitted_at,
      filledAt: o.filled_at,
      canceledAt: o.canceled_at,
      expiredAt: o.expired_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    await cancelOrder(orderId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
