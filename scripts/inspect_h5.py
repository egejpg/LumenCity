"""
inspect_h5.py — data/ klasöründeki ilk HDF5 dosyasının yapısını yazdırır.
Kullanım: python inspect_h5.py
"""
import os, h5py

files = sorted(f for f in os.listdir("data") if f.endswith(".h5"))
if not files:
    print("data/ klasöründe .h5 dosyası yok.")
    exit(1)

path = os.path.join("data", files[0])
print(f"Dosya: {path}\n")

def walk(name, obj):
    if isinstance(obj, h5py.Dataset):
        print(f"  DATASET  {name}  shape={obj.shape}  dtype={obj.dtype}")
    else:
        print(f"  GROUP    {name}/")

with h5py.File(path, "r") as f:
    print("=== Kök grup anahtarları ===")
    for k in f.keys():
        print(f"  {k}")
    print("\n=== Tüm nesneler ===")
    f.visititems(walk)
