import App from "../api";
export async function POST(req:any) {
  try {
    const body = await req.json();
    const response = await App.post("/api/auth/signup/", body, {
      withCredentials: true,
    });
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error:any) {
    return new Response(
      JSON.stringify(error.response?.data || { message: "Server Error" }),
      { status: error.response?.status || 500 },
    );
  }
}
