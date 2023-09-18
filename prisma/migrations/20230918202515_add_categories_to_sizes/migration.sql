-- CreateTable
CREATE TABLE "_CategoryToProductSize" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProductSize_AB_unique" ON "_CategoryToProductSize"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProductSize_B_index" ON "_CategoryToProductSize"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToProductSize" ADD CONSTRAINT "_CategoryToProductSize_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProductSize" ADD CONSTRAINT "_CategoryToProductSize_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;
