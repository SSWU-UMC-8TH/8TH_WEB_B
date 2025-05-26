import { useMutation } from "@tanstack/react-query";


async function likeLpApi({ lpId }: { lpId: number }) {

  return Promise.resolve({ success: true });
}

export default function useLikeLp() {
  return useMutation({
    mutationFn: likeLpApi,
  });
}