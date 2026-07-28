-- Allow anonymous users to insert enquiries directly from the frontend
CREATE POLICY "Enable insert for anon users" ON "public"."enquiries"
AS PERMISSIVE FOR INSERT
TO anon
WITH CHECK (true);
