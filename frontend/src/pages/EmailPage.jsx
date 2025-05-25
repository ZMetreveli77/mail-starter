import { useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AuthContext } from "@/components/AuthContext"
import { formatDate } from "@/lib/utils"

export const Email = () => {
  const { emailCategory, emailId } = useParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  const deleteEmail = async () => {
     try {
    const res = await fetch(`/emails/${emailId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete email");

    navigate("/c/inbox");
  } catch (err) {
    console.error(err);
    alert("Failed to delete email.");
  }
  }

  const reply = () => {
    navigate("/compose", {
      state: {
        recipients: [email.sender, ...email.recipients]
          .filter((r) => r.email !== user.email)
          .map((r) => r.email)
          .join(","),
        subject: `Re: ${email.subject}`,
        body: `\n\n----\non ${formatDate(email.sentAt)}, ${
          email.sender.email
        } wrote:\n\n${email.body}`
      }
    })
  }

  const toggleArchive = async () => {
     try {
    const res = await fetch(`/emails/${emailId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ archived: !email.archived }),
    });

    if (!res.ok) throw new Error("Failed to update archive status");

    const updated = await res.json();
    setEmail(updated);
  } catch (err) {
    console.error(err);
    alert("Failed to archive email.");
  }
  }

  const formatTextWithNewlines = (text) => {
    return text?.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))
  }

  useEffect(() => {
     const fetchEmail = async () => {
    try {
      const res = await fetch(`/emails/${emailId}`, {
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to fetch email");

      const data = await res.json();
      setEmail(data);
    } catch (err) {
      console.error(err);
      navigate("/c/inbox");
    } finally {
      setLoading(false);
    }
  };

  fetchEmail();
  }, [emailId, navigate]);

  if (loading) {
    return null
  }

  return (
    <div>
      <div>
        <h2 className="font-medium text-3xl">
          {email.subject}
        </h2>
        <Badge className="my-4">
          {emailCategory}
        </Badge>
        <ul className="pb-4 border-b flex flex-col gap-2">
          <li>
            <span className="font-bold">From:</span>{" "}
            <span>
              {email.sender.name} &lt;{email.sender.email}&gt;
            </span>
          </li>
          <li>
            <span className="font-bold">To:</span>{" "}
            <span>{email.recipients.map((r) => r.email).join(", ")}</span>
          </li>
          <li>
            <span>
              {formatDate(email.sentAt)}
            </span>
          </li>
        </ul>
        <p className="my-4">{formatTextWithNewlines(email.body)}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reply} variant="outline">
          Reply
        </Button>
        {emailCategory !== "sent" && (
          <Button  onClick={toggleArchive} variant="outline">
            {email.archived ? "Unarchive" : "Archive"}
          </Button>
        )}
        <Button onClick={deleteEmail} variant="outlineDestructive">
          Delete
        </Button>
      </div>
    </div>
  )
}
