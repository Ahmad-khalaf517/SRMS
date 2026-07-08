import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@srms/ui/components/card';

import { Button } from '@srms/ui/components/button';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reason, from } = location.state || {};

  if (!reason || !from) {
    return <Navigate to={from || '/'} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>

          <CardTitle className="text-3xl font-bold">Access Denied</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-6xl font-bold text-muted-foreground">403</p>

          <p className="text-sm text-muted-foreground">
            You don't have permission to access this page.
          </p>

          <p className="text-sm text-muted-foreground">
            Please contact your administrator if you believe this is a mistake.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
