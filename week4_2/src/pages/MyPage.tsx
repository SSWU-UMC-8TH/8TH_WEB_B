import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auts";
import { ResponseMyInfoDto } from "../types/auts";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  },[])

  return (
    <div>
      {data.data.name} {data.data.email}
    </div>
  );
}

export default MyPage;