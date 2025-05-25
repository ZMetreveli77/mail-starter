import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";

export const EmailList = ({ emailCategory }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const deleteEmail = async (id) => {
      try {
    await fetch(`/emails/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    navigate("/c/inbox");
  } catch (err) {
    console.error("Failed to delete email", err);
  }
  };

  useEffect(() => {
    const fetchEmails = async () => {
    try {
      const res = await fetch(`/emails/c/${emailCategory}`, {
        credentials: "include"
      });
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error("Failed to fetch emails", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEmails();
  }, [emailCategory]);

  return (
    <div className="my-4 divide-y">
      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ) : emails.length === 0 ? (
        <h2 className="my-6">No emails</h2>
      ) : (
        emails.map((email) => (
          <div className="py-3 gap-4" key={email._id}>
            <div className="flex gap-4 items-center">
          
              <Link to={`/c/${emailCategory}/${email._id}`} className="flex justify-between grow gap-4">
                <div className="font-medium hidden md:block">
                  {email.from}
                </div>
                <div className="">{email.subject}</div>
                <div className="hidden md:block">
                  {formatDate(email.createdAt)}
                </div>
              </Link>
              <div>
                
                <Button
                 onClick={() => deleteEmail(email._id)}
                  className="p-2 flex items-center h-auto"
                  variant="outlineDestructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
