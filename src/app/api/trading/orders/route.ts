import { NextResponse } from "next/server";
import { getOrders, placeOrder, cancelAllOrders } from "@/lib/api/alpaca";

function mapOrder(o: Record<string, unknown>) {
  return {
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
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const limit = parseInt(searchParams.get("limit") || "100");
    const data = await getOrders(status, limit);
    const orders = (data || []).map(mapOrder);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await placeOrder(body);
    return NextResponse.json(mapOrder(data));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await cancelAllOrders();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
