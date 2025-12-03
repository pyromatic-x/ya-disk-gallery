"use server";

export const action_notify_about_bug = async ({ error }: { error: string }) => {
  try {
    const formData = new FormData();
    formData.append("chat_id", process.env.TELEGRAM_BOT_CHAT);
    formData.append("text", `❌ Disk app error: ${error}`);

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      body: formData,
    });

    return true;
  } catch (error) {
    throw error as Error;
  }
};
