import { useEffect, useState } from "react";

export default function useFetch(url: string) {

  const [error, setError] = useState(undefined)
  const [data, setData] = useState<Response | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  async function fetchFrom(url: string) {
    setLoading(true)
    try {
      await fetch(url)
      .then(res => res.json())
      .then(data => setData(data))
    }
    catch (error: any) {
      setError(error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFrom(url)
  },[])

  return {
    data, loading, error
  }

}