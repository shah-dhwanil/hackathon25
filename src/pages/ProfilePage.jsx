import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { AlertCircle } from "lucide-react";

export default function UserProfilePage() {
  const userId = 1;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const sampleUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "Senior Developer",
      location: "San Francisco, CA",
      joinDate: "2023-01-15",
      bio: "Full-stack developer with 5+ years of experience.",
    },
  ];

  const stats = {
    questionCount: 12,
    answerCount: 34,
    totalVotes: 142,
    bestAnswers: 8,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundUser = sampleUsers.find((u) => u.id === String(userId));
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError("User not found");
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  if (loading) return <UserProfileSkeleton />;
  if (error || !user) return <UserNotFound error={error} />;

  return (
    <div className="min-h-screen py-12 flex justify-center bg-gray-100">
      <Card className="w-[90%] rounded-xl shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
                <p className="text-muted-foreground">{user.role}</p>
                <p className="text-sm text-gray-500">{user.location}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Joined on:{" "}
              <span className="text-gray-700 font-medium">{user.joinDate}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg text-gray-800">Bio</h3>
            <p className="text-gray-600 mt-2">{user.bio}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {stats.questionCount}
              </p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {stats.answerCount}
              </p>
              <p className="text-xs text-gray-500">Answers</p>
            </div>
            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {stats.totalVotes}
              </p>
              <p className="text-xs text-gray-500">Total Votes</p>
            </div>
            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {stats.bestAnswers}
              </p>
              <p className="text-xs text-gray-500">Best Answers</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate(-1)}
              className="bg-primary hover:bg-primary/90"
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserProfileSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[90%] rounded-xl shadow-md">
        <CardContent className="p-8 text-center space-y-4 animate-pulse">
          <div className="h-24 w-24 mx-auto rounded-full bg-muted" />
          <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

function UserNotFound({ error }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[90%] max-w-md rounded-xl shadow-md">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The user doesn't exist or has been deleted."}
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-red-500 hover:bg-red-600"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
